import type { LocalizedString } from "@gc-digital-talent/graphql";

interface WhatToExpectAdmissionFields {
  whatToExpectAdmission?: LocalizedString | null;
}

// Note: Field is optional so we only validate for null state
export function hasAllEmptyFields({
  whatToExpectAdmission,
}: WhatToExpectAdmissionFields): boolean {
  return !!(!whatToExpectAdmission?.en && !whatToExpectAdmission?.fr);
}

export function hasOneEmptyField({
  whatToExpectAdmission,
}: WhatToExpectAdmissionFields): boolean {
  return (
    !!(whatToExpectAdmission?.en && !whatToExpectAdmission?.fr) ||
    !!(whatToExpectAdmission?.fr && !whatToExpectAdmission.en)
  );
}
