import { isPast } from "date-fns/isPast";

import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { PoolStatus } from "@gc-digital-talent/graphql";
import type { LocalizedEnumValue } from "@gc-digital-talent/i18n";

interface ClosingDateFields {
  closingDate?: string | null;
}

export function hasEmptyRequiredFields({
  closingDate,
}: ClosingDateFields): boolean {
  return !closingDate;
}

interface ClosingDateStatusFields extends ClosingDateFields {
  status?: LocalizedEnumValue<PoolStatus> | null;
}

export function hasInvalidRequiredFields({
  closingDate,
  status,
}: ClosingDateStatusFields): boolean {
  if (status?.value === PoolStatus.Draft && closingDate) {
    return isPast(parseDateTimeUtc(closingDate));
  }

  return !closingDate;
}
