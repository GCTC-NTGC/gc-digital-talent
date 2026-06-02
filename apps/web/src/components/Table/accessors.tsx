import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import type { Scalars } from "@gc-digital-talent/graphql";

function dateAccessor(
  value: Scalars["DateTime"]["output"] | null | undefined,
): Date | null {
  return value ? parseDateTimeUtc(value) : null;
}

export default {
  date: dateAccessor,
};
