import { User } from "@gc-digital-talent/graphql";
import isEmpty from "lodash/isEmpty";

type PartialUser = Pick<User, "expectedGenericJobTitles">;

export function anyCriteriaSelected({ expectedGenericJobTitles }: PartialUser) {
  return !isEmpty(expectedGenericJobTitles);
}

export function hasAllEmptyFields(applicant: PartialUser): boolean {
  return !anyCriteriaSelected(applicant);
}

export function hasEmptyRequiredFields(applicant: PartialUser): boolean {
  return !anyCriteriaSelected(applicant);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function hasEmptyOptionalFields(applicant: PartialUser): boolean {
  // no optional fields
  return false;
}
