import type { LocalizedString } from "@gc-digital-talent/graphql";

export interface WorkStreamOption {
  id: string;
  name?: LocalizedString | null;
}

export interface CommunityOption {
  id: string;
  name?: LocalizedString | null;
  workStreams?: WorkStreamOption[] | null;
}

export interface WorkStreamsWithCommunity {
  workStreams: WorkStreamOption[];
  community: CommunityOption;
}
