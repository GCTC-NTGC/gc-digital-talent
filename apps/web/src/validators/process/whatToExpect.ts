import type { LocalizedString } from "@gc-digital-talent/graphql";

interface WhatToExpectFields {
  whatToExpect?: LocalizedString | null;
}

// Note: Field is optional so we only validate for null state
export function hasAllEmptyFields({
  whatToExpect,
}: WhatToExpectFields): boolean {
  return !!(!whatToExpect?.en && !whatToExpect?.fr);
}
