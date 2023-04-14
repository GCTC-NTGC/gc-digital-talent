import { Applicant } from "@gc-digital-talent/graphql";
import isEmpty from "lodash/isEmpty";

type PartialApplicant = Pick<
  Applicant,
  "locationPreferences" | "locationExemptions"
>;

export function anyCriteriaSelected(applicant: PartialApplicant): boolean {
  return !isEmpty(applicant.locationPreferences);
}

export function hasAllEmptyFields(applicant: PartialApplicant): boolean {
  return !anyCriteriaSelected(applicant);
}

export function hasEmptyRequiredFields(applicant: PartialApplicant): boolean {
  return !anyCriteriaSelected(applicant);
}

export function hasEmptyOptionalFields(applicant: PartialApplicant): boolean {
  return !applicant.locationExemptions;
}
