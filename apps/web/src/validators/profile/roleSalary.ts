import { Applicant } from "@gc-digital-talent/graphql";
import isEmpty from "lodash/isEmpty";

type PartialApplicant = Pick<Applicant, "expectedGenericJobTitles">;

export function anyCriteriaSelected({
  expectedGenericJobTitles,
}: PartialApplicant) {
  return !isEmpty(expectedGenericJobTitles);
}

export function hasAllEmptyFields(applicant: PartialApplicant): boolean {
  return !anyCriteriaSelected(applicant);
}

export function hasEmptyRequiredFields(applicant: PartialApplicant): boolean {
  return !anyCriteriaSelected(applicant);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function hasEmptyOptionalFields(applicant: PartialApplicant): boolean {
  // no optional fields
  return false;
}
