import { IndigenousCommunity, UpdateUserAsUserMutation } from "~/api/generated";

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
}

export interface IndigenousDialogProps {
  indigenousCommunities: Array<IndigenousCommunity>;
  onSave: (indigenousCommunities: Array<IndigenousCommunity>) => void;
  children: React.ReactNode;
}
