import type { FieldLabels } from "@gc-digital-talent/forms";
import type {
  Application_PoolCandidateFragment,
  UpdateUserAsUserInput,
  UpdateUserAsUserMutation,
} from "@gc-digital-talent/graphql";

export type SectionKey =
  | "personal"
  | "work"
  | "dei"
  | "citizen-veteran-priority"
  | "government"
  | "language"
  | "account";

export interface SectionProps<P = void> {
  isUpdating?: boolean;
  application?: Application_PoolCandidateFragment;
  pool?: P | null;
  onUpdate: (
    id: string,
    user: UpdateUserAsUserInput,
  ) => Promise<UpdateUserAsUserMutation["updateUserAsUser"]>;
}

export interface FormFieldProps<TOptions = object> {
  labels: FieldLabels;
  optionsQuery?: TOptions;
}
