export const DATE_SEGMENT = {
  Year: "YEAR",
  Month: "MONTH",
  Day: "DAY",
} as const;

type ObjectValues<T> = T[keyof T];
export type DateSegment = ObjectValues<typeof DATE_SEGMENT>;

export type SegmentIds = Record<DateSegment, string>;

export type DateConstraint = {
  min: Date | null;
  max: Date | null;
};

export interface DateInputSegmentProps {
  onChange: (newValue: string) => void;
  value: string;
  show: Array<DateSegment>;
}
