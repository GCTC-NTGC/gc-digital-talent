import React from "react";

import { Role, User } from "@gc-digital-talent/graphql";
import { Pill } from "@gc-digital-talent/ui";

import RemoveIndividualRoleDialog from "./RemoveIndividualRoleDialog";
import { UpdateUserFunc } from "../types";

export function roleCell(displayName: string) {
  return (
    <Pill color="black" mode="solid">
      {displayName}
    </Pill>
  );
}

export function actionCell(
  role: Role,
  user: User,
  onUpdateUser: UpdateUserFunc,
) {
  return (
    <RemoveIndividualRoleDialog
      role={role}
      user={user}
      onUpdateUser={onUpdateUser}
    />
  );
}
