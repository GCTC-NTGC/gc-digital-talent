/**
 * @jest-environment jsdom
 */

import { createIntl, createIntlCache } from "react-intl";
import { parseISO } from "date-fns";
import { tz } from "@date-fns/tz";
import { register } from "timezone-mock";

import {
  convertDateTimeToDate,
  convertDateTimeZone,
  DATETIME_FORMAT_STRING,
  formatDate,
  parseDateTimeUtc,
  relativeClosingDate,
} from "./index";

describe("relativeClosingDate tests", () => {
  const intlCache = createIntlCache();
  const intl = createIntl(
    {
      locale: "en",
    },
    intlCache,
  );
  const f = relativeClosingDate;

  test("expired", () => {
    const s = f({
      closingDate: new Date("2021-12-31"),
      now: new Date("2022-01-01"),
      intl,
    });
    expect(s).toBe("The deadline for submission has passed.");
  });

  test("today", () => {
    const s = f({
      closingDate: new Date("2021-12-31 23:59:59"),
      now: new Date("2021-12-31 23:00:00"),
      intl,
    });
    expect(s).toBe("Closes today at 11:59 PM");
  });

  // tomorrow might not be 24 hours away
  test("tomorrow", () => {
    const s = f({
      closingDate: new Date("2021-12-31 00:59:59"),
      now: new Date("2021-12-30 23:59:59"),
      intl,
    });
    expect(s).toBe("Closes tomorrow at 12:59 AM");
  });

  test("future days", () => {
    const s = f({
      closingDate: new Date("2021-12-31 00:59:59"),
      now: new Date("2021-12-01"),
      intl,
    });
    expect(s).toBe("December 31st, 2021 12:59 AM");
  });

  // https://dateful.com/convert/pacific-time-pt?t=1159pm&d=2021-12-31&tz2=Eastern-Time-ET
  test("today in a different time zone", () => {
    const s = f({
      closingDate: parseISO("2021-12-31 23:59:59", {
        in: tz("Canada/Pacific"),
      }),
      now: parseISO("2022-01-01 01:00:00", { in: tz("Canada/Eastern") }),
      intl,
      timeZone: "Canada/Pacific",
    });
    expect(s).toBe("Closes today at 11:59 PM");
  });

  // https://dateful.com/convert/pacific-time-pt?t=1159pm&d=2021-12-31&tz2=Eastern-Time-ET
  test("tomorrow in a different time zone", () => {
    const s = f({
      closingDate: parseISO("2021-12-31 23:59:59", {
        in: tz("Canada/Pacific"),
      }),
      now: parseISO("2021-12-31 00:00:00", { in: tz("Canada/Eastern") }),
      intl,
      timeZone: "Canada/Pacific",
    });
    expect(s).toBe("Closes tomorrow at 11:59 PM");
  });

  // https://dateful.com/convert/pacific-time-pt?t=1159pm&d=2021-12-31&tz2=Eastern-Time-ET
  test("future days in a different time zone", () => {
    const s = f({
      closingDate: parseISO("2021-12-31 23:59:59", {
        in: tz("Canada/Pacific"),
      }),
      now: parseISO("2021-12-01", { in: tz("Canada/Eastern") }),
      intl,
      timeZone: "Canada/Pacific",
    });
    expect(s).toBe("December 31st, 2021 11:59 PM");
  });
});

describe("convert zone for DateTime tests", () => {
  const f = convertDateTimeZone;
  test("it converts PDT to UTC", () => {
    // https://dateful.com/convert/pacific-time-pt?t=1159pm&d=2022-10-31&tz2=UTC
    expect(f("2022-10-31 23:59:59", "Canada/Pacific", "UTC")).toBe(
      "2022-11-01 06:59:59",
    );
  });
  test("it converts PST to UTC", () => {
    // https://dateful.com/convert/pacific-time-pt?t=1159pm&d=2022-11-30&tz2=UTC
    expect(f("2022-11-30 23:59:59", "Canada/Pacific", "UTC")).toBe(
      "2022-12-01 07:59:59",
    );
  });
  test("it converts UTC to PDT", () => {
    // https://dateful.com/convert/utc?t=659am&d=2022-11-01&tz2=Pacific-Time-PT
    expect(f("2022-11-01 06:59:59", "UTC", "Canada/Pacific")).toBe(
      "2022-10-31 23:59:59",
    );
  });
  test("it converts to UTC to PST", () => {
    // https://dateful.com/convert/utc?t=759am&d=2022-12-01&tz2=Pacific-Time-PT
    expect(f("2022-12-01 07:59:59", "UTC", "Canada/Pacific")).toBe(
      "2022-11-30 23:59:59",
    );
  });
});

describe("convert DateTime to Date tests", () => {
  const f = convertDateTimeToDate;
  test("it converts a regular DateTime to a Date", () => {
    expect(f("2022-12-01 07:59:59")).toBe("2022-12-01");
  });
});

describe("parse DateTime UTC to native Date tests", () => {
  const f = parseDateTimeUtc;
  test("it parses regular UTC DateTime to a native Date", () => {
    const actualValue = f("2000-01-01 00:00:00");
    const expectedValue = new Date("2000-01-01T00:00:00.000Z");

    expect(actualValue?.valueOf()).toBe(expectedValue.valueOf());
  });
});

describe.only("format date in different timezones", () => {
  const f = formatDate;
  const intlCache = createIntlCache();
  const intl = createIntl(
    {
      locale: "en",
    },
    intlCache,
  );

  test("it formats with timezone UTC provided", () => {
    register("US/Eastern");
    const actual = f({
      date: parseDateTimeUtc("2022-01-01 00:00:00+00:00"),
      formatString: DATETIME_FORMAT_STRING,
      intl,
    });

    expect(actual).toBe("2021-12-31 19:00:00");
  });

  test("it formats with timzone Eastern provide", () => {
    // NOTE: This is odd but +5 is actually -5
    // REF: https://www.npmjs.com/package/timezone-mock#:~:text=Etc/GMT%2B5%20timezone%20is%20equivalent%20to%20US%20Eastern%20Standard%20Time%20(UTC%2D5).
    register("Etc/GMT+5");
    const actual = f({
      date: parseDateTimeUtc("2022-01-01 00:00:00-05:00"),
      formatString: DATETIME_FORMAT_STRING,
      intl,
    });

    expect(actual).toBe("2022-01-01 00:00:00");
  });

  test("it formats with no timezone provided", () => {
    register("US/Pacific");
    const actual = f({
      date: parseDateTimeUtc("2022-01-01 00:00:00"),
      formatString: DATETIME_FORMAT_STRING,
      intl,
    });

    expect(actual).toBe("2021-12-31 16:00:00");
  });
});
