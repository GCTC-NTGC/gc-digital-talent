import {
  UpdateUserAboutMeMutation,
  UpdateUserAsUserInput,
  User,
} from "~/api/generated";

export type PartialUser = Pick<
  User,
  | "preferredLang"
  | "preferredLanguageForInterview"
  | "preferredLanguageForExam"
  | "currentProvince"
  | "currentCity"
  | "telephone"
  | "firstName"
  | "lastName"
  | "email"
  | "citizenship"
  | "armedForcesStatus"
>;

export type FormValues = PartialUser;

export type AboutMeUpdateHandler = (
  id: string,
  data: UpdateUserAsUserInput,
) => Promise<UpdateUserAboutMeMutation["updateUserAsUser"]>;
