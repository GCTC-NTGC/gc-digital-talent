import { Pool, PoolCandidate, User } from "@gc-digital-talent/graphql";

import ChangeStatusDialog from "../../pages/Users/UserInformationPage/components/ChangeStatusDialog";
import ChangeDateDialog from "../../pages/Users/UserInformationPage/components/ChangeDateDialog";

export const statusCell = (
  candidate: PoolCandidate,
  user: User,
  pools: Pool[],
) => (
  <ChangeStatusDialog selectedCandidate={candidate} user={user} pools={pools} />
);

export const expiryCell = (candidate: PoolCandidate, user: User) => (
  <ChangeDateDialog selectedCandidate={candidate} user={user} />
);
