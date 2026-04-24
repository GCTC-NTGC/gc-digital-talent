import type { UpdateUserAsUserInput } from "@gc-digital-talent/graphql";

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
