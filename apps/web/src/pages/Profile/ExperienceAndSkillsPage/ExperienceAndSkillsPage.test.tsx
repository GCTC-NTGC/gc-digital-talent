/**
 * @jest-environment jsdom
 */
import { compareByDate } from "~/types/experience";
import { Applicant, Experience } from "~/api/generated";
import { ExperienceForDate } from "./components/ExperienceAndSkills";

const applicant: Applicant = { email: "blank", id: "blank" };
const generateExperience = (
  startDate?: string,
  endDate?: string,
): ExperienceForDate => ({
  id: "0",
  applicant,
  endDate,
  startDate,
});

describe("ExperienceAndSkills tests", () => {
  test("Should sort experiences by date correctly with no end date", () => {
    const e1 = generateExperience("1990-01-01");
    const e2 = generateExperience("1995-01-02");
    const e3 = generateExperience("2010-01-03");
    const e4 = generateExperience("2021-01-04");

    const experiences: Experience[] = [e1, e3, e2, e4];
    const sortedByDate = experiences.sort(compareByDate); // Should sort to most recent startDate
    expect(sortedByDate).toStrictEqual([e4, e3, e2, e1]);
  });
  test("Should sort experiences by date correctly with no start date", () => {
    const e1 = generateExperience("", "1990-01-01");
    const e2 = generateExperience("", "1995-01-02");
    const e3 = generateExperience("", "2010-01-03");
    const e4 = generateExperience("", "2021-01-04");

    const experiences: Experience[] = [e1, e3, e2, e4];
    const sortedByDate = experiences.sort(compareByDate); // Should sort to most recent endDate
    expect(sortedByDate).toStrictEqual([e4, e3, e2, e1]);
  });
  test("Should sort experiences by date correctly", () => {
    const e1 = generateExperience("1988-03-32", "1990-01-01");
    const e2 = generateExperience("1995-01-02", "");
    const e3 = generateExperience("2020-01-02", "");
    const e4 = generateExperience("", "2021-01-04");
    const e5 = generateExperience("", "2010-01-03");

    const experiences: Experience[] = [e1, e3, e2, e4, e5];
    const sortedByDate = experiences.sort(compareByDate); // Should sort to most recent endDate
    expect(sortedByDate).toStrictEqual([e3, e2, e4, e5, e1]);
  });
});
