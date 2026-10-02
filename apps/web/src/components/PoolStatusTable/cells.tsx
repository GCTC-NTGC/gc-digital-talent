import type { FragmentType } from "@gc-digital-talent/graphql";

import type {
  CandidateName,
  ChangeDateDialog_PoolCandidateFragment,
} from "~/components/CandidateDialog/ChangeDateDialog";
import ChangeDateDialog from "~/components/CandidateDialog/ChangeDateDialog";

export const expiryCell = (
  candidate: FragmentType<typeof ChangeDateDialog_PoolCandidateFragment>,
  user: CandidateName,
) => <ChangeDateDialog selectedCandidateQuery={candidate} user={user} />;
