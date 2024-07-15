import { UserInfoFragment } from "@gc-digital-talent/graphql";

import { JobPlacementOptionsFragmentType } from "~/components/PoolCandidatesTable/JobPlacementDialog";

export interface BasicUserInformationProps {
  user: UserInfoFragment;
}

export interface UserInformationProps extends BasicUserInformationProps {
  jobPlacementOptions: JobPlacementOptionsFragmentType;
}
