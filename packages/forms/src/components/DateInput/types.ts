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
