import {
  UpdateUserAboutMeMutation,
  UpdateUserAsUserInput,
  User,
} from "~/api/generated";

export type FormValues = Pick<
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

export type AboutMeUpdateHandler = (
  id: string,
  data: UpdateUserAsUserInput,
) => Promise<UpdateUserAboutMeMutation["updateUserAsUser"]>;
