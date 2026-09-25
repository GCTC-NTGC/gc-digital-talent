import { createIntl, createIntlCache } from "react-intl";
import { parseISO } from "date-fns/parseISO";
import { tz } from "@date-fns/tz";
import { register } from "timezone-mock";

import {
  convertDateTimeToDate,
  convertDateTimeZone,
  DATETIME_FORMAT_STRING,
  formatDate,
  parseDateTimeUtc,
  relativeClosingDate,
  sortDateBy,
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
        in: tz("America/Vancouver"),
      }),
      now: parseISO("2022-01-01 01:00:00", { in: tz("Canada/Eastern") }),
      intl,
      timeZone: "America/Vancouver",
    });
    expect(s).toBe("Closes today at 11:59 PM");
  });

  // https://dateful.com/convert/pacific-time-pt?t=1159pm&d=2021-12-31&tz2=Eastern-Time-ET
  test("tomorrow in a different time zone", () => {
    const s = f({
      closingDate: parseISO("2021-12-31 23:59:59", {
        in: tz("America/Vancouver"),
      }),
      now: parseISO("2021-12-31 00:00:00", { in: tz("Canada/Eastern") }),
      intl,
      timeZone: "America/Vancouver",
    });
    expect(s).toBe("Closes tomorrow at 11:59 PM");
  });

  // https://dateful.com/convert/pacific-time-pt?t=1159pm&d=2021-12-31&tz2=Eastern-Time-ET
  test("future days in a different time zone", () => {
    const s = f({
      closingDate: parseISO("2021-12-31 23:59:59", {
        in: tz("America/Vancouver"),
      }),
      now: parseISO("2021-12-01", { in: tz("Canada/Eastern") }),
      intl,
      timeZone: "America/Vancouver",
    });
    expect(s).toBe("December 31st, 2021 11:59 PM");
  });
});

describe("convert zone for DateTime tests", () => {
  const f = convertDateTimeZone;
  test("it converts PDT to UTC", () => {
    // https://dateful.com/convert/pacific-time-pt?t=1159pm&d=2022-10-31&tz2=UTC
    expect(f("2022-10-31 23:59:59", "America/Vancouver", "UTC")).toBe(
      "2022-11-01 06:59:59",
    );
  });
  test("it converts PST to UTC", () => {
    // https://dateful.com/convert/pacific-time-pt?t=1159pm&d=2022-11-30&tz2=UTC
    expect(f("2022-11-30 23:59:59", "America/Vancouver", "UTC")).toBe(
      "2022-12-01 07:59:59",
    );
  });
  test("it converts UTC to PDT", () => {
    // https://dateful.com/convert/utc?t=659am&d=2022-11-01&tz2=Pacific-Time-PT
    expect(f("2022-11-01 06:59:59", "UTC", "America/Vancouver")).toBe(
      "2022-10-31 23:59:59",
    );
  });
  test("it converts to UTC to PST", () => {
    // https://dateful.com/convert/utc?t=759am&d=2022-12-01&tz2=Pacific-Time-PT
    expect(f("2022-12-01 07:59:59", "UTC", "America/Vancouver")).toBe(
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

describe("format date in different timezones", () => {
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

const OLDEST = {
  date: "2000-01-01",
};

const MIDDLE = {
  date: "2010-06-15",
};

const NEWEST = {
  date: "2020-12-31",
};

const MISSING = {
  date: null,
};

describe("Sorting an array of objects by date", () => {
  it("sorts ascending", () => {
    const newValues = [MIDDLE, NEWEST, OLDEST].sort(
      sortDateBy((x) => x.date, "asc"),
    );

    expect(newValues).toEqual([OLDEST, MIDDLE, NEWEST]);
  });

  it("sorts descending", () => {
    const newValues = [MIDDLE, NEWEST, OLDEST].sort(
      sortDateBy((x) => x.date, "desc"),
    );

    expect(newValues).toEqual([NEWEST, MIDDLE, OLDEST]);
  });

  it("sorts ascending by default", () => {
    const newValues = [MIDDLE, NEWEST, OLDEST].sort(sortDateBy((x) => x.date));

    expect(newValues).toEqual([OLDEST, MIDDLE, NEWEST]);
  });

  it("sorts date objects", () => {
    const first = { date: new Date("2000-01-01") };
    const second = { date: new Date("2020-12-31") };
    const newValues = [second, first].sort(sortDateBy((x) => x.date, "asc"));

    expect(newValues).toEqual([first, second]);
  });

  it("sorts a mix of strings and date objects", () => {
    const first: { date: string | Date } = { date: new Date("2000-01-01") };
    const second: { date: string | Date } = { date: "2020-12-31" };
    const newValues = [second, first].sort(sortDateBy((x) => x.date, "asc"));

    expect(newValues).toEqual([first, second]);
  });

  it("sorts a null value last ascending", () => {
    const newValues = [NEWEST, MISSING, OLDEST].sort(
      sortDateBy((x) => x.date, "asc"),
    );

    expect(newValues).toEqual([OLDEST, NEWEST, MISSING]);
  });

  it("sorts a null value first descending", () => {
    const newValues = [OLDEST, MISSING, NEWEST].sort(
      sortDateBy((x) => x.date, "desc"),
    );

    expect(newValues).toEqual([MISSING, NEWEST, OLDEST]);
  });

  it("sorts an undefined value last ascending", () => {
    const absent: { date?: string } = {};
    const newValues = [absent, NEWEST, OLDEST].sort(
      sortDateBy((x) => x.date, "asc"),
    );

    expect(newValues).toEqual([OLDEST, NEWEST, absent]);
  });

  it("does not sort two missing values", () => {
    const first = { id: 1, date: null };
    const second = { id: 2, date: undefined };
    const newValues = [second, first].sort(sortDateBy((x) => x.date, "asc"));

    expect(newValues).toEqual([second, first]);
  });
});

describe("Sorting dates that are close together", () => {
  it("sorts two dates one millisecond apart ascending", () => {
    const earlier = { date: "2020-06-15T12:00:00.001Z" };
    const later = { date: "2020-06-15T12:00:00.002Z" };
    const newValues = [later, earlier].sort(sortDateBy((x) => x.date, "asc"));

    expect(newValues).toEqual([earlier, later]);
  });

  it("sorts two dates one millisecond apart descending", () => {
    const earlier = { date: "2020-06-15T12:00:00.001Z" };
    const later = { date: "2020-06-15T12:00:00.002Z" };
    const newValues = [earlier, later].sort(sortDateBy((x) => x.date, "desc"));

    expect(newValues).toEqual([later, earlier]);
  });

  it("sorts a string and a date one millisecond apart", () => {
    const earlier: { date: string | Date } = {
      date: "2020-06-15T12:00:00.001Z",
    };
    const later: { date: string | Date } = {
      date: new Date("2020-06-15T12:00:00.002Z"),
    };
    const newValues = [later, earlier].sort(sortDateBy((x) => x.date, "asc"));

    expect(newValues).toEqual([earlier, later]);
  });

  it("sorts the last second of one day before the first second of the next day", () => {
    const earlier = { date: "2020-06-15T23:59:59Z" };
    const later = { date: "2020-06-16T00:00:00Z" };
    const newValues = [later, earlier].sort(sortDateBy((x) => x.date, "asc"));

    expect(newValues).toEqual([earlier, later]);
  });

  it("leaves two objects in their original order when both dates are the same time", () => {
    const first = { id: 1, date: "2020-06-15T12:00:00.000Z" };
    const second = { id: 2, date: "2020-06-15T12:00:00.000Z" };
    const newValues = [second, first].sort(sortDateBy((x) => x.date, "asc"));

    expect(newValues).toEqual([second, first]);
  });
});

describe("Sort dates written with a timezone offset", () => {
  it("sorts two dates that show the same time of day with different timezone offsets", () => {
    const earlier = { date: "2020-06-15T12:00:00+02:00" };
    const later = { date: "2020-06-15T12:00:00-02:00" };
    const newValues = [later, earlier].sort(sortDateBy((x) => x.date, "asc"));

    expect(newValues).toEqual([earlier, later]);
  });

  it("sorts two dates one minute apart where the earlier date has the larger timezone offset", () => {
    const earlier = { date: "2022-11-06T01:30:00-04:00" };
    const later = { date: "2022-11-06T01:31:00-05:00" };
    const newValues = [later, earlier].sort(sortDateBy((x) => x.date, "asc"));

    expect(newValues).toEqual([earlier, later]);
  });
});
