import { UpdateUserAsUserInput } from "~/api/generated";

export type FormValues = Pick<
  UpdateUserAsUserInput,
  | "acceptedOperationalRequirements"
  | "locationPreferences"
  | "locationExemptions"
> & {
  wouldAcceptTemporary?: string;
};
