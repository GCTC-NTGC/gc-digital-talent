import {
  FragmentType,
  User,
  ChangeStatusDialog_UserFragment as ChangeStatusDialogUserFragmentType,
} from "@gc-digital-talent/graphql";

import ChangeDateDialog, {
  ChangeDateDialog_PoolCandidateFragment,
} from "~/components/CandidateDialog/ChangeDateDialog";
import ChangeStatusDialog, {
  ChangeStatusDialog_PoolCandidateFragment,
} from "~/components/CandidateDialog/ChangeStatusDialog";

export const statusCell = (
  candidate: FragmentType<typeof ChangeStatusDialog_PoolCandidateFragment>,
  user: Pick<
    ChangeStatusDialogUserFragmentType,
    "firstName" | "lastName" | "poolCandidates"
  >,
) => <ChangeStatusDialog selectedCandidateQuery={candidate} user={user} />;

export const expiryCell = (
  candidate: FragmentType<typeof ChangeDateDialog_PoolCandidateFragment>,
  user: Pick<User, "firstName" | "lastName">,
) => <ChangeDateDialog selectedCandidateQuery={candidate} user={user} />;
