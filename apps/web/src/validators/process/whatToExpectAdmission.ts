import { Pool } from "@gc-digital-talent/graphql";

// Note: Field is optional so we only validate for null state
// eslint-disable-next-line import/prefer-default-export
export function hasAllEmptyFields({ whatToExpectAdmission }: Pool): boolean {
  return !!(!whatToExpectAdmission?.en && !whatToExpectAdmission?.fr);
}
