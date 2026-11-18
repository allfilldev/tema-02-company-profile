import type { TeamMember } from "@/core/domain/team/team-member";

export interface TeamRepository {
  listPublished(): Promise<TeamMember[]>;
  findById(id: string): Promise<TeamMember | null>;
}
