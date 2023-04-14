import { FieldLabels } from "@gc-digital-talent/forms";
import {
  UpdateUserAboutMeMutation,
  UpdateUserAsUserInput,
  User,
} from "~/api/generated";

export interface SectionProps {
  user: User;
  isUpdating?: boolean;
  onUpdate: (
    id: string,
    user: UpdateUserAsUserInput,
  ) => Promise<UpdateUserAboutMeMutation["updateUserAsUser"]>;
}

export interface FormFieldProps {
  labels: FieldLabels;
}
