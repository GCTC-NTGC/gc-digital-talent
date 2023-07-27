import { RegisterOptions, ValidationValueMessage } from "react-hook-form";

export const DATE_SEGMENT = {
  Year: "YEAR",
  Month: "MONTH",
  Day: "DAY",
} as const;

type ObjectValues<T> = T[keyof T];
export type DateSegment = ObjectValues<typeof DATE_SEGMENT>;

export type SegmentObject = {
  year?: string;
  month?: string;
  day?: string;
};

// We only want to allow passing a value + message
type DateMinMax = {
  min: ValidationValueMessage<string>;
  max: ValidationValueMessage<string>;
};

export type DateRegisterOptions = Omit<RegisterOptions, "min" | "max"> &
  Partial<DateMinMax>;
