import { SalaryRange } from "../api/generated";
import { getOrThrowError } from "../helpers/util";

export const getSalaryRanges = {
  [SalaryRange["50_59K"]]: "$50,000 - $59,000",
  [SalaryRange["60_69K"]]: "$60,000 - $69,000",
  [SalaryRange["70_79K"]]: "$70,000 - $79,000",
  [SalaryRange["80_89K"]]: "$80,000 - $89,000",
  [SalaryRange["90_99K"]]: "$90,000 - $99,000",
  [SalaryRange["100KPlus"]]: "$100,000 - plus",
};

export const getSalaryRange = (getSalaryId: string | number): string =>
  getOrThrowError(getSalaryRanges, getSalaryId, "invalid Salary Range");
