import { FieldLabels } from "@gc-digital-talent/forms";
import {
  Maybe,
  PoolAdvertisement,
  UpdateUserAboutMeMutation,
  UpdateUserAsUserInput,
  User,
} from "@gc-digital-talent/graphql";

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
  poolAdvertisement: Maybe<PoolAdvertisement>;
}

export interface FormFieldProps {
  labels: FieldLabels;
}
