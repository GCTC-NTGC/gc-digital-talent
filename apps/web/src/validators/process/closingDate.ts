import isPast from "date-fns/isPast";

import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

import { Pool } from "~/api/generated";

// Only one field to check here
// eslint-disable-next-line import/prefer-default-export
export function hasEmptyRequiredFields({ closingDate }: Pool): boolean {
  return !closingDate || isPast(parseDateTimeUtc(closingDate));
}
