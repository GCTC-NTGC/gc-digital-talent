import type { FragmentType, User } from "@gc-digital-talent/graphql";

import type { ChangeDateDialog_PoolCandidateFragment } from "~/components/CandidateDialog/ChangeDateDialog";
import ChangeDateDialog from "~/components/CandidateDialog/ChangeDateDialog";

export const expiryCell = (
  candidate: FragmentType<typeof ChangeDateDialog_PoolCandidateFragment>,
  user: Pick<User, "firstName" | "lastName">,
) => <ChangeDateDialog selectedCandidateQuery={candidate} user={user} />;
