import type {
  AdminCollectionRepository,
  ArticleAdminRepository,
  MoveDirection,
} from "@/core/domain/admin/admin-repositories";
import type {
  AdminInputByModule,
  AdminModule,
  AdminRecordByModule,
  ArticleRecord,
  TeamMemberRecord,
} from "@/core/domain/admin/records";

const NOW = "2026-11-20T03:00:00.000Z";

type Stored = { id: string; sortOrder?: number; updatedAt: string };

export function createMemoryCollection<Module extends AdminModule>(
  module: Module,
  initial: AdminRecordByModule[Module][] = [],
): AdminCollectionRepository<Module> & { records: AdminRecordByModule[Module][] } {
  const records: AdminRecordByModule[Module][] = [...initial];
  let counter = records.length;

  function find(id: string): AdminRecordByModule[Module] {
    const record = records.find((candidate) => (candidate as unknown as Stored).id === id);
    if (!record) {
      throw new Error(`${module} ${id} not found`);
    }
    return record;
  }

  function replace(next: AdminRecordByModule[Module]): AdminRecordByModule[Module] {
    const index = records.findIndex((candidate) => (candidate as unknown as Stored).id === (next as unknown as Stored).id);
    records[index] = next;
    return next;
  }

  return {
    records,
    async list() {
      return [...records].sort((left, right) => ((left as unknown as Stored).sortOrder ?? 0) - ((right as unknown as Stored).sortOrder ?? 0));
    },
    async findById(id) {
      return records.find((candidate) => (candidate as unknown as Stored).id === id) ?? null;
    },
    async create(input: AdminInputByModule[Module]) {
      counter += 1;
      const maxOrder = Math.max(0, ...records.map((record) => (record as unknown as Stored).sortOrder ?? 0));
      const base = module === "articles" ? { status: "draft", publishedAt: null } : module === "stats" ? {} : { isPublished: false };
      const created = { ...input, ...base, id: `${module}-${counter}`, sortOrder: maxOrder + 1, updatedAt: NOW } as unknown as AdminRecordByModule[Module];
      records.push(created);
      return created;
    },
    async update(id, input) {
      return replace({ ...find(id), ...input, updatedAt: NOW } as AdminRecordByModule[Module]);
    },
    async remove(id) {
      records.splice(records.indexOf(find(id)), 1);
    },
    async setPublished(id, published) {
      const current = find(id) as unknown as Record<string, unknown>;
      if (module === "articles") {
        const publishedAt = published ? ((current.publishedAt as string | null) ?? NOW) : (current.publishedAt as string | null);
        return replace({ ...current, status: published ? "published" : "draft", publishedAt } as unknown as AdminRecordByModule[Module]);
      }
      return replace({ ...current, isPublished: published } as unknown as AdminRecordByModule[Module]);
    },
    async move(id, direction: MoveDirection) {
      const ordered = [...records].sort((left, right) => ((left as unknown as Stored).sortOrder ?? 0) - ((right as unknown as Stored).sortOrder ?? 0));
      const index = ordered.findIndex((record) => (record as unknown as Stored).id === id);
      const neighbor = ordered[direction === "up" ? index - 1 : index + 1];
      if (!neighbor) {
        return;
      }
      const first = ordered[index] as unknown as Stored;
      const second = neighbor as unknown as Stored;
      const swap = first.sortOrder;
      first.sortOrder = second.sortOrder;
      second.sortOrder = swap;
    },
  };
}

export function createMemoryArticleCounts(articles: { records: ArticleRecord[] }): ArticleAdminRepository {
  return {
    async countByAuthor(teamMemberId) {
      const mine = articles.records.filter((article) => article.authorId === teamMemberId);
      return { all: mine.length, published: mine.filter((article) => article.status === "published").length };
    },
  };
}

export function buildTeamMemberRecord(overrides: Partial<TeamMemberRecord> = {}): TeamMemberRecord {
  return {
    id: "team-1",
    name: "Rina Wulandari",
    jobTitle: "Konsultan Senior",
    bio: "Pengalaman menyusun SOP untuk usaha kecil dan menengah.",
    photo: null,
    yearsExperience: 8,
    profiles: [],
    sortOrder: 1,
    isPublished: true,
    updatedAt: NOW,
    ...overrides,
  };
}
