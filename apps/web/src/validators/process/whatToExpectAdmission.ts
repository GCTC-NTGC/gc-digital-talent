import { Pool } from "@gc-digital-talent/graphql";

// Note: Field is optional so we only validate for null state
// eslint-disable-next-line import/prefer-default-export
export function hasAllEmptyFields({
  whatToExpectAdmission,
}: Pick<Pool, "whatToExpectAdmission">): boolean {
  return !!(!whatToExpectAdmission?.en && !whatToExpectAdmission?.fr);
}

export function hasOneEmptyField({
  whatToExpectAdmission,
}: Pick<Pool, "whatToExpectAdmission">): boolean {
  return (
    !!(whatToExpectAdmission?.en && !whatToExpectAdmission?.fr) ||
    !!(whatToExpectAdmission?.fr && !whatToExpectAdmission.en)
  );
}
