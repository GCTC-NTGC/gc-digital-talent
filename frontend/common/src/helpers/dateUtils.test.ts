/**
 * @jest-environment jsdom
 */

import {
  convertDateTimeToDate,
  convertDateTimeZone,
  parseDateTimeUtc,
} from "./dateUtils";

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
