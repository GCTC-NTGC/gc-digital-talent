import type { IntlShape } from "react-intl";
import { vi } from "vitest";

import { experienceGenerators } from "@gc-digital-talent/fake-data";

import { experienceDurationMonths, getExperienceDate } from "./experienceUtils";

describe("experience utils test", () => {
  const intl = { locale: "en" } as IntlShape;

  test("function getExperienceDate", () => {
    const fakeAward = experienceGenerators.awardExperiences()[0];
    const fakeWork = experienceGenerators.workExperiences()[0];

    // return the faked experience dates correctly
    expect(getExperienceDate(fakeAward, intl)).toBe("October 1992");
    expect(getExperienceDate(fakeWork, intl)).toBe(
      "October 1992 - October 1993",
    );

    // test undefined and nulls do not throw errors, but return a falsy value
    expect(
      getExperienceDate({ ...fakeAward, awardedDate: undefined }, intl),
    ).toBe(undefined);

    expect(getExperienceDate({ ...fakeAward, awardedDate: null }, intl)).toBe(
      undefined,
    );

    expect(
      getExperienceDate(
        { ...fakeWork, startDate: undefined, endDate: undefined },
        intl,
      ),
    ).toBe("");

    expect(
      getExperienceDate({ ...fakeWork, startDate: null, endDate: null }, intl),
    ).toBe("");

    // empty string case
    expect(getExperienceDate({ ...fakeAward, awardedDate: "" }, intl)).toBe(
      undefined,
    );

    expect(
      getExperienceDate({ ...fakeWork, startDate: "", endDate: "" }, intl),
    ).toBe("");
  });

  describe("experience duration", () => {
    beforeEach(() => {
      vi.useRealTimers(); // some tests will mock the time and this will reset it for the next test
    });

    // make a fake award experience for the given award date
    const fakeAwardExperience = (awardDate: string) => {
      const e = experienceGenerators.awardExperiences(1)[0];
      e.awardedDate = awardDate;
      return e;
    };
    // make a fake community experience for the given start and end dates
    const fakeCommunityExperience = (
      startDate: string,
      endDate: string | null,
    ) => ({
      ...experienceGenerators.communityExperiences(1)[0],
      startDate,
      endDate,
    });

    test("award experience", () => {
      const experience = fakeAwardExperience("1970-01-01");
      const months = experienceDurationMonths(experience);
      expect(months).toBe(0);
    });
    test("less than a month", () => {
      const experience = fakeCommunityExperience("1970-01-01", "1970-01-31");
      const months = experienceDurationMonths(experience);
      expect(months).toBe(1);
    });
    test("just over a month", () => {
      const experience = fakeCommunityExperience("1970-01-01", "1970-02-01");
      const months = experienceDurationMonths(experience);
      expect(months).toBe(2);
    });
    test("no end date", () => {
      vi.useFakeTimers().setSystemTime(new Date("1970-01-31"));
      const experience = fakeCommunityExperience("1970-01-01", null);
      const months = experienceDurationMonths(experience);
      expect(months).toBe(1);
    });
    test("future end date", () => {
      vi.useFakeTimers().setSystemTime(new Date("1970-01-31"));
      const experience = fakeCommunityExperience("1970-01-01", "2000-01-01");
      const months = experienceDurationMonths(experience);
      expect(months).toBe(1);
    });
    test("over a year", () => {
      const experience = fakeCommunityExperience("1970-01-01", "1971-01-31");
      const months = experienceDurationMonths(experience);
      expect(months).toBe(13);
    });
  });
});
