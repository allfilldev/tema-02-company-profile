import type {
  AdminCollectionRepository,
  ArticleAdminRepository,
  MoveDirection,
} from "@/core/domain/admin/admin-repositories";
import type { AdminInputByModule, AdminModule, AdminRecordByModule } from "@/core/domain/admin/records";
import type { ModuleKey } from "@/core/domain/shared/module-key";
import { failure, success, type AdminResult } from "@/core/application/admin/admin-result";
import { draftSchemaFor } from "@/core/application/admin/draft-schemas";
import { hasPublishProblems, validateForPublish } from "@/core/application/admin/publish-validation";

export type CollectionAdminDeps<Module extends AdminModule> = {
  module: Module;
  repository: AdminCollectionRepository<Module>;
  articles: ArticleAdminRepository;
  team: AdminCollectionRepository<"team">;
  siteName: () => Promise<string>;
  enabledModules: readonly ModuleKey[];
};

export type SaveCommand = {
  id?: string;
  values: unknown;
  publish?: boolean;
};

type LooseRecord = AdminRecordByModule[AdminModule];

interface LooseRepository {
  list(): Promise<LooseRecord[]>;
  findById(id: string): Promise<LooseRecord | null>;
  create(input: unknown): Promise<LooseRecord>;
  update(id: string, input: unknown): Promise<LooseRecord>;
  remove(id: string): Promise<void>;
  setPublished(id: string, published: boolean): Promise<LooseRecord>;
  move(id: string, direction: MoveDirection): Promise<void>;
}

const NOT_FOUND_MESSAGE = "Data tidak ditemukan.";
const NO_PUBLISH_MESSAGE = "Modul ini tidak punya status terbit.";
const NO_MOVE_MESSAGE = "Artikel selalu terurut menurut tanggal terbit dan tidak bisa diurutkan manual.";

function isPublishedRecord(module: AdminModule, record: LooseRecord): boolean {
  if (module === "stats") return false;
  if (module === "articles") return (record as AdminRecordByModule["articles"]).status === "published";
  return (record as { isPublished: boolean }).isPublished;
}

function slugOf(record: LooseRecord | null): string[] {
  return record && "slug" in record ? [record.slug] : [];
}

function uniqueSlugs(...groups: string[][]): string[] {
  return [...new Set(groups.flat())];
}

export function createCollectionAdmin<Module extends AdminModule>(deps: CollectionAdminDeps<Module>) {
  const { module } = deps;
  const repository = deps.repository as unknown as LooseRepository;
  const supportsPublishing = module !== "stats";

  async function validate(record: LooseRecord) {
    return validateForPublish(module, record, { siteName: await deps.siteName(), enabledModules: deps.enabledModules });
  }

  async function checkArticleAuthor(record: LooseRecord, validation: Awaited<ReturnType<typeof validate>>): Promise<void> {
    if (module !== "articles") return;
    const authorId = (record as AdminRecordByModule["articles"]).authorId;
    if (!authorId) return;
    const author = await deps.team.findById(authorId);
    if (!author || !author.isPublished) {
      validation.fieldErrors.authorId = "Penulis harus anggota tim yang sudah terbit.";
    }
  }

  async function publishValidation(record: LooseRecord) {
    const validation = await validate(record);
    await checkArticleAuthor(record, validation);
    return validation;
  }

  function candidateFrom(existing: LooseRecord | null, values: object): LooseRecord {
    const base = existing ?? {
      id: "new",
      sortOrder: 0,
      isPublished: false,
      status: "draft",
      publishedAt: null,
      updatedAt: new Date().toISOString(),
    };
    return { ...base, ...values } as unknown as LooseRecord;
  }

  return {
    async list(): Promise<AdminRecordByModule[Module][]> {
      return (await repository.list()) as AdminRecordByModule[Module][];
    },

    async get(id: string): Promise<AdminRecordByModule[Module] | null> {
      return (await repository.findById(id)) as AdminRecordByModule[Module] | null;
    },

    async save(command: SaveCommand): Promise<AdminResult<AdminRecordByModule[Module]>> {
      const parsed = draftSchemaFor(module).safeParse(command.values);
      if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          const field = String(issue.path[0] ?? "form");
          if (!(field in fieldErrors)) fieldErrors[field] = issue.message;
        }
        return failure(["Periksa kembali isian yang ditandai."], fieldErrors);
      }

      const input = parsed.data as AdminInputByModule[Module];
      const existing = command.id ? await repository.findById(command.id) : null;
      if (command.id && !existing) {
        return failure([NOT_FOUND_MESSAGE]);
      }

      const alreadyPublished = existing ? isPublishedRecord(module, existing) : false;
      const wantsPublish = supportsPublishing && command.publish === true;
      let warnings: string[] = [];

      if (wantsPublish || alreadyPublished) {
        const validation = await publishValidation(candidateFrom(existing, input));
        warnings = validation.warnings;
        if (hasPublishProblems(validation)) {
          return failure(validation.blocking, validation.fieldErrors, validation.warnings);
        }
      }

      const saved = existing ? await repository.update(existing.id, input) : await repository.create(input);
      const final = wantsPublish && !isPublishedRecord(module, saved) ? await repository.setPublished(saved.id, true) : saved;

      return success(
        final as AdminRecordByModule[Module],
        { module, slugs: uniqueSlugs(slugOf(existing), slugOf(final)) },
        warnings,
      );
    },

    async setPublished(id: string, published: boolean): Promise<AdminResult<AdminRecordByModule[Module]>> {
      if (!supportsPublishing) {
        return failure([NO_PUBLISH_MESSAGE]);
      }
      const record = await repository.findById(id);
      if (!record) {
        return failure([NOT_FOUND_MESSAGE]);
      }

      let warnings: string[] = [];
      if (published) {
        const validation = await publishValidation(record);
        warnings = validation.warnings;
        if (hasPublishProblems(validation)) {
          return failure(validation.blocking, validation.fieldErrors, validation.warnings);
        }
      } else if (module === "team") {
        const counts = await deps.articles.countByAuthor(id);
        if (counts.published > 0) {
          return failure([`Anggota tim ini masih menjadi penulis ${counts.published} artikel terbit.`]);
        }
      }

      const updated = await repository.setPublished(id, published);
      return success(updated as AdminRecordByModule[Module], { module, slugs: slugOf(updated) }, warnings);
    },

    async remove(id: string): Promise<AdminResult<undefined>> {
      const record = await repository.findById(id);
      if (!record) {
        return failure([NOT_FOUND_MESSAGE]);
      }
      if (module === "team") {
        const counts = await deps.articles.countByAuthor(id);
        if (counts.all > 0) {
          return failure([`Anggota tim ini masih menjadi penulis ${counts.all} artikel.`]);
        }
      }
      await repository.remove(id);
      return success(undefined, { module, slugs: slugOf(record) });
    },

    async move(id: string, direction: MoveDirection): Promise<AdminResult<undefined>> {
      if (module === "articles") {
        return failure([NO_MOVE_MESSAGE]);
      }
      await repository.move(id, direction);
      return success(undefined, { module, slugs: [] });
    },
  };
}
