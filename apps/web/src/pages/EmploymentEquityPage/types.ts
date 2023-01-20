/* Note: Just defining func signature */
/* eslint-disable no-unused-vars */
import React from "react";
import type {
  UpdateUserAsUserInput,
  UpdateUserAsUserMutation,
} from "~/api/generated";

export type UserMutationPromise = Promise<
  UpdateUserAsUserMutation["updateUserAsUser"]
>;

export type EquityKeys =
  | "isWoman"
  | "isIndigenous"
  | "isVisibleMinority"
  | "hasDisability";

export interface EquityDialogProps {
  isAdded: boolean;
  onSave: (value: boolean) => void;
  children: React.ReactNode;
}

export type EquityDialogFooterProps = Pick<
  EquityDialogProps,
  "isAdded" | "onSave"
>;

export type EmploymentEquityUpdateHandler = (
  id: string,
  data: UpdateUserAsUserInput,
) => Promise<UpdateUserAsUserMutation["updateUserAsUser"]>;
