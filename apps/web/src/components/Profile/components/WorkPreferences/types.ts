import { UpdateUserAsUserInput, User } from "@gc-digital-talent/graphql";

export type PartialUser = Pick<
  User,
  | "acceptedOperationalRequirements"
  | "positionDuration"
  | "locationPreferences"
  | "locationExemptions"
>;

export type FormValues = Pick<
  UpdateUserAsUserInput,
  | "acceptedOperationalRequirements"
  | "locationPreferences"
  | "locationExemptions"
> & {
  wouldAcceptTemporary?: string;
};
