import { FieldLabels } from "@gc-digital-talent/forms/types";
import {
  Application_PoolCandidateFragment,
  Maybe,
  UpdateUserAsUserInput,
  UpdateUserAsUserMutation,
  UserProfileFragment as UserProfileFragmentType,
} from "@gc-digital-talent/graphql";

export type SectionKey =
  | "personal"
  | "work"
  | "dei"
  | "government"
  | "language"
  | "account";

export interface SectionProps<P = void> {
  user: UserProfileFragmentType;
  isUpdating?: boolean;
  application?: Application_PoolCandidateFragment;
  pool?: Maybe<P>;
  onUpdate: (
    id: string,
    user: UpdateUserAsUserInput,
  ) => Promise<UpdateUserAsUserMutation["updateUserAsUser"]>;
}

export interface FormFieldProps<TOptions = object> {
  labels: FieldLabels;
  optionsQuery?: TOptions;
}
