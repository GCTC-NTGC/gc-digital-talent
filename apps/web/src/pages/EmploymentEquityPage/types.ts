/* Note: Just defining func signature */
/* eslint-disable no-unused-vars */
import React from "react";
import type {
  IndigenousCommunity,
  UpdateUserAsUserInput,
  UpdateUserAsUserMutation,
} from "~/api/generated";

export type UserMutationPromise = Promise<
  UpdateUserAsUserMutation["updateUserAsUser"]
>;

export type EquityKeys =
  | "isWoman"
  | "indigenousCommunities"
  | "isVisibleMinority"
  | "hasDisability";

export interface EquityDialogProps {
  isAdded: boolean;
  onSave: (value: boolean) => void;
  children: React.ReactNode;
}

export interface IndigenousDialogProps {
  indigenousCommunities: Array<IndigenousCommunity>;
  onSave: (indigenousCommunities: Array<IndigenousCommunity>) => void;
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
