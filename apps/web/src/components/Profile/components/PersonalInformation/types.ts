import { User } from "~/api/generated";

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
