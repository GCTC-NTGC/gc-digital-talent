import { FieldLabels } from "@gc-digital-talent/forms";
import {
  UpdateUserAboutMeMutation,
  UpdateUserAsUserInput,
  User,
} from "~/api/generated";

import { ApplicationPageProps } from "../ApplicationApi";

export type SectionKey =
  | "personal"
  | "work"
  | "dei"
  | "government"
  | "language";

export interface SectionProps {
  user: User;
  isUpdating?: boolean;
  application?: ApplicationPageProps["application"];
  onUpdate: (
    id: string,
    user: UpdateUserAsUserInput,
  ) => Promise<UpdateUserAboutMeMutation["updateUserAsUser"]>;
}

export interface FormFieldProps {
  labels: FieldLabels;
}
