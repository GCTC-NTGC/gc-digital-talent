import { isPast } from "date-fns/isPast";

import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { Pool, PoolStatus } from "@gc-digital-talent/graphql";

export function hasEmptyRequiredFields({ closingDate }: Pool): boolean {
  return !closingDate;
}

export function hasInvalidRequiredFields({
  closingDate,
  status,
}: Pool): boolean {
  if (status === PoolStatus.Draft && closingDate) {
    return isPast(parseDateTimeUtc(closingDate));
  }

  return !closingDate;
}
