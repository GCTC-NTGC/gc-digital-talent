import { UserInfoFragment } from "@gc-digital-talent/graphql";

import { JobPlacementOptionsFragmentType } from "~/components/PoolCandidateDialogs/JobPlacementForm";

export interface BasicUserInformationProps {
  user: UserInfoFragment;
}

export interface UserInformationProps extends BasicUserInformationProps {
  jobPlacementOptions: JobPlacementOptionsFragmentType;
}
