import {
  IndigenousCommunity,
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
  onSave: (value: boolean) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export interface IndigenousUpdateProps {
  indigenousCommunities: Array<IndigenousCommunity>;
  indigenousDeclarationSignature?: string | null;
}

export interface IndigenousDialogProps {
  indigenousCommunities: Array<IndigenousCommunity>;
  signature: string | undefined;
  onSave: (data: IndigenousUpdateProps) => void;
  children: React.ReactNode;
  disabled?: boolean;
}
