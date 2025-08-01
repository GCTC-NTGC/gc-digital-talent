import { UpdateUserAsUserInput, User } from "@gc-digital-talent/graphql";

export type PartialUser = Pick<
  User,
  | "currentCity"
  | "currentProvince"
  | "acceptedOperationalRequirements"
  | "positionDuration"
  | "locationPreferences"
  | "flexibleWorkLocations"
  | "locationExemptions"
>;

export type FormValues = Pick<
  UpdateUserAsUserInput,
  | "currentCity"
  | "currentProvince"
  | "acceptedOperationalRequirements"
  | "locationPreferences"
  | "flexibleWorkLocations"
  | "locationExemptions"
> & {
  wouldAcceptTemporary?: string;
};
