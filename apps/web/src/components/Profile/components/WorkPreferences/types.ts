import { UpdateUserAsUserInput, User } from "@gc-digital-talent/graphql";

export type PartialUser = Pick<
  User,
  | "currentCity"
  | "currentProvince"
  | "acceptedOperationalRequirements"
  | "positionDuration"
  | "locationPreferences"
  | "locationExemptions"
>;

export type FormValues = Pick<
  UpdateUserAsUserInput,
  | "currentCity"
  | "currentProvince"
  | "acceptedOperationalRequirements"
  | "locationPreferences"
  | "locationExemptions"
> & {
  wouldAcceptTemporary?: string;
};
