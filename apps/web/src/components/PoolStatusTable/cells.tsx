import React from "react";

import { PoolCandidate, User } from "@gc-digital-talent/graphql";

import ChangeStatusDialog from "../../pages/Users/UserInformationPage/components/ChangeStatusDialog";
import ChangeDateDialog from "../../pages/Users/UserInformationPage/components/ChangeDateDialog";

export const statusCell = (candidate: PoolCandidate, user: User) => (
  <ChangeStatusDialog selectedCandidate={candidate} user={user} />
);

export const expiryCell = (candidate: PoolCandidate, user: User) => (
  <ChangeDateDialog selectedCandidate={candidate} user={user} />
);
