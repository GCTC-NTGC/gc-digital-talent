import isPast from "date-fns/isPast";

import { Pool } from "@gc-digital-talent/graphql";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

// Only one field to check here
// eslint-disable-next-line import/prefer-default-export
export function hasEmptyRequiredFields({ closingDate }: Pool): boolean {
  return !closingDate || isPast(parseDateTimeUtc(closingDate));
}
