import { FieldLabels } from "@gc-digital-talent/forms";
import {
  PoolCandidate,
  UpdateUserAsUserInput,
  UpdateUserAsUserMutation,
  User,
} from "@gc-digital-talent/graphql";

export type SectionKey =
  | "personal"
  | "work"
  | "dei"
  | "government"
  | "language"
  | "account";

export interface SectionProps {
  user: User;
  isUpdating?: boolean;
  application?: PoolCandidate;
  onUpdate: (
    id: string,
    user: UpdateUserAsUserInput,
  ) => Promise<UpdateUserAsUserMutation["updateUserAsUser"]>;
}

export interface FormFieldProps {
  labels: FieldLabels;
}
