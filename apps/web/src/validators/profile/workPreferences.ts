import { Applicant } from "@gc-digital-talent/graphql";
import isEmpty from "lodash/isEmpty";

type PartialApplicant = Pick<
  Applicant,
  "acceptedOperationalRequirements" | "positionDuration"
>;

export function hasAllEmptyFields({
  positionDuration,
}: PartialApplicant): boolean {
  return isEmpty(positionDuration);
}

export function hasEmptyRequiredFields({
  positionDuration,
}: PartialApplicant): boolean {
  return isEmpty(positionDuration);
}

export function hasEmptyOptionalFields({
  acceptedOperationalRequirements,
}: PartialApplicant): boolean {
  return isEmpty(acceptedOperationalRequirements);
}
