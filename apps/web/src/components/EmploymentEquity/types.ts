import { ReactNode } from "react";

import {
  IndigenousCommunity,
  LocalizedIndigenousCommunity,
  UpdateUserAsUserMutation,
} from "@gc-digital-talent/graphql";

export type EquityKeys =
  | "isWoman"
  | "indigenousCommunities"
  | "isVisibleMinority"
  | "hasDisability";

export type UserMutationPromise = Promise<
  UpdateUserAsUserMutation["updateUserAsUser"]
>;

export interface EquityDialogProps {
  isAdded: boolean;
  onSave: (value: boolean) => Promise<void>;
  children: ReactNode;
  disabled?: boolean;
}

export interface IndigenousUpdateProps {
  indigenousCommunities: IndigenousCommunity[];
  indigenousDeclarationSignature?: string | null;
}

export interface IndigenousDialogProps {
  indigenousCommunities: LocalizedIndigenousCommunity[];
  signature: string | undefined;
  onSave: (data: IndigenousUpdateProps) => Promise<void>;
  children: ReactNode;
  disabled?: boolean;
}
