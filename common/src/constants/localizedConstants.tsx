import { defineMessages, MessageDescriptor } from "react-intl";
import { Language, SalaryRange } from "../api/generated";
import { getOrThrowError } from "../helpers/util";

export const salaryRanges = {
  [SalaryRange["50_59K"]]: "$50,000 - $59,000",
  [SalaryRange["60_69K"]]: "$60,000 - $69,000",
  [SalaryRange["70_79K"]]: "$70,000 - $79,000",
  [SalaryRange["80_89K"]]: "$80,000 - $89,000",
  [SalaryRange["90_99K"]]: "$90,000 - $99,000",
  [SalaryRange["100KPlus"]]: "$100,000 - plus",
};

export const getSalaryRange = (getSalaryId: string | number): string =>
  getOrThrowError(salaryRanges, getSalaryId, "Invalid Salary Range");

export const languages = defineMessages({
  [Language.En]: {
    defaultMessage: "English",
  },
  [Language.Fr]: {
    defaultMessage: "French",
  },
});

export const getLanguage = (
  getLanguageId: string | number,
): MessageDescriptor =>
  getOrThrowError(languages, getLanguageId, "Invalid Language");

export const educationRequirements = defineMessages({
  hasDiploma: {
    id: "hasDiploma",
    defaultMessage: "Required diploma from post-secondary institution",
  },
  doesNotHaveDiploma: {
    id: "doesNotHaveDiploma",
    defaultMessage: "Can accept a combination of work experience and education",
  },
});

export const getEducationRequirement = (
  getEducationRequirementId: string | number,
): MessageDescriptor =>
  getOrThrowError(
    educationRequirements,
    getEducationRequirementId,
    "Invalid Education Requirement",
  );
