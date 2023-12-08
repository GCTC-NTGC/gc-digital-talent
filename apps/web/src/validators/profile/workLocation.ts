import isEmpty from "lodash/isEmpty";

import { User } from "~/api/generated";

export type PartialUser = Pick<
  User,
  "locationPreferences" | "locationExemptions"
>;

export function anyCriteriaSelected(applicant: PartialUser): boolean {
  return !isEmpty(applicant.locationPreferences);
}

export function hasAllEmptyFields(applicant: PartialUser): boolean {
  return !anyCriteriaSelected(applicant);
}

export function hasEmptyRequiredFields(applicant: PartialUser): boolean {
  return !anyCriteriaSelected(applicant);
}
