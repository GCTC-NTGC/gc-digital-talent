import { parse, isDate } from "date-fns";
import {
  SeparatedDateRange,
  SeparatedDateString,
} from "@gc-digital-talent/date-helpers/dist/types";

export type SegmentIds = Record<"year" | "month" | "day", string>;

const validateIsDate = <T>(value: string) => {
  return isDate(value);
};

export const getDateValidation = <T>(
  segmentIds: SegmentIds,
  constraints: SeparatedDateRange,
) => ({
  isDate: validateIsDate<T>,
});

export const getYearValidation = <T>(max?: SeparatedDateString) => {
  return (value: string) => {
    parseInt(value) > max?.year;
  };
};
