import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

import { Maybe, Scalars } from "~/api/generated";

function dateAccessor(
  value: Maybe<Scalars["DateTime"]> | undefined,
): Date | null {
  return value ? parseDateTimeUtc(value) : null;
}

export default {
  date: dateAccessor,
};
