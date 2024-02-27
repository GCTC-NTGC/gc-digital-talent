import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { Maybe, Scalars } from "@gc-digital-talent/graphql";

function dateAccessor(
  value: Maybe<Scalars["DateTime"]["output"]> | undefined,
): Date | null {
  return value ? parseDateTimeUtc(value) : null;
}

export default {
  date: dateAccessor,
};
