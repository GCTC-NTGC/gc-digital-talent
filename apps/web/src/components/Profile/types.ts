import { FieldLabels } from "@gc-digital-talent/forms";

import {
  GetMeQuery,
  Maybe,
  Pool,
  UpdateUserAsUserInput,
  UpdateUserAsUserMutation,
} from "~/api/generated";
import { ApplicationPageProps } from "~/pages/Applications/ApplicationApi";

export type SectionKey =
  | "personal"
  | "work"
  | "dei"
  | "government"
  | "language"
  | "account";

export type ApplicantProfileUser = NonNullable<GetMeQuery["me"]>;

export interface SectionProps {
  user: ApplicantProfileUser;
  isUpdating?: boolean;
  application?: ApplicationPageProps["application"];
  onUpdate: (
    id: string,
    user: UpdateUserAsUserInput,
  ) => Promise<UpdateUserAsUserMutation["updateUserAsUser"]>;
  pool: Maybe<Pool>;
}

export interface FormFieldProps {
  labels: FieldLabels;
}
