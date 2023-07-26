import { User } from "@gc-digital-talent/graphql";
import isEmpty from "lodash/isEmpty";

export type PartialUser = Pick<User, "expectedGenericJobTitles">;

export function anyCriteriaSelected({ expectedGenericJobTitles }: PartialUser) {
  return !isEmpty(expectedGenericJobTitles);
}

export function hasAllEmptyFields(applicant: PartialUser): boolean {
  return !anyCriteriaSelected(applicant);
}

export function hasEmptyRequiredFields(applicant: PartialUser): boolean {
  return !anyCriteriaSelected(applicant);
}
