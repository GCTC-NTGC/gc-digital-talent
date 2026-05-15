import { createIntl, createIntlCache } from "react-intl";

import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

import cells from "./cells";

const intl = createIntl(
  {
    locale: "en",
  },
  createIntlCache(),
);

describe("date cell", () => {
  it("renders date-only values without a time", () => {
    const value = "2026-04-20";

    expect(cells.date(value, intl)).toBe(
      formatDate({
        date: parseDateTimeUtc(value),
        formatString: "PPP",
        intl,
      }),
    );
  });

  it("renders date-time values with a time", () => {
    const value = "2026-04-20 20:21:00";

    expect(cells.date(value, intl)).toBe(
      formatDate({
        date: parseDateTimeUtc(value),
        formatString: "PPP p",
        intl,
      }),
    );
  });
});
