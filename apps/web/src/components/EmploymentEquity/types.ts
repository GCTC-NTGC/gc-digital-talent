import type { ReactNode } from "react";

import type {
  IndigenousCommunity,
  UpdateUserAsUserMutation,
} from "@gc-digital-talent/graphql";
import type { GenericLocalizedEnum } from "@gc-digital-talent/i18n";

export type EquityKeys =
  "isWoman" | "indigenousCommunities" | "isVisibleMinority" | "hasDisability";

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
  indigenousCommunities: GenericLocalizedEnum<IndigenousCommunity>[];
  signature: string | undefined;
  onSave: (data: IndigenousUpdateProps) => Promise<void>;
  children: ReactNode;
  disabled?: boolean;
}
