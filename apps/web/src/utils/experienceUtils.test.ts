/**
 * @jest-environment jsdom
 */

import { IntlShape } from "react-intl";

import { experienceGenerators } from "@gc-digital-talent/fake-data";

import { getExperienceDate } from "./experienceUtils";

describe("experience utils test", () => {
  const intl = { locale: "en" } as IntlShape;

  test("test function getExperienceDate", () => {
    const fakeAward = experienceGenerators.awardExperiences()[0];
    const fakeWork = experienceGenerators.workExperiences()[0];

    // return the faked experience dates correctly
    expect(getExperienceDate(fakeAward, intl)).toBe("October 1992");
    expect(getExperienceDate(fakeWork, intl)).toBe(
      "October 1992 - October 1993",
    );

    // test undefined and nulls do not throw errors, but return a falsy value
    fakeAward.awardedDate = undefined;
    expect(getExperienceDate(fakeAward, intl)).toBe(undefined);

    fakeAward.awardedDate = null;
    expect(getExperienceDate(fakeAward, intl)).toBe(undefined);

    fakeWork.startDate = undefined;
    fakeWork.endDate = undefined;
    expect(getExperienceDate(fakeWork, intl)).toBe("");

    fakeWork.startDate = null;
    fakeWork.endDate = null;
    expect(getExperienceDate(fakeWork, intl)).toBe("");

    // empty string case
    fakeAward.awardedDate = "";
    expect(getExperienceDate(fakeAward, intl)).toBe(undefined);

    fakeWork.startDate = "";
    fakeWork.endDate = "";
    expect(getExperienceDate(fakeWork, intl)).toBe("");
  });
});
