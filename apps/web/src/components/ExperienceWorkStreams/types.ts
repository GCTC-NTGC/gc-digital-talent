import { Community, WorkStream } from "@gc-digital-talent/graphql";

export type CommunityWithoutKey = Omit<Community, "key">;
export type WorkStreamWithoutKey = Omit<WorkStream, "key" | "community">;
export interface WorkStreamsWithCommunity {
  workStreams: WorkStreamWithoutKey[];
  community: CommunityWithoutKey;
}
