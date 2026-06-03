import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

function dateAccessor(value: string | null | undefined): Date | null {
  return value ? parseDateTimeUtc(value) : null;
}

export default {
  date: dateAccessor,
};
