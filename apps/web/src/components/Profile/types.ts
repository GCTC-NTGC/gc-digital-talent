import { FieldLabels } from "@gc-digital-talent/forms";
import {
  Application_PoolCandidateFragment,
  Maybe,
  UpdateUserAsUserInput,
  UpdateUserAsUserMutation,
} from "@gc-digital-talent/graphql";

export type SectionKey =
  | "personal"
  | "work"
  | "dei"
  | "priority"
  | "government"
  | "language"
  | "account";

export interface SectionProps<P = void> {
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
