import { UpdateUserAsUserInput, User } from "@gc-digital-talent/graphql";

export type PartialUser = Pick<
  User,
  | "currentCity"
  | "currentProvince"
  | "acceptedOperationalRequirements"
  | "positionDuration"
  | "flexibleWorkLocations"
  | "locationExemptions"
>;

export type FormValues = Pick<
  UpdateUserAsUserInput,
  | "currentCity"
  | "currentProvince"
  | "acceptedOperationalRequirements"
  | "flexibleWorkLocations"
  | "locationExemptions"
> & {
  wouldAcceptTemporary?: string;
};
