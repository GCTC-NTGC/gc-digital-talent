import { format } from "date-fns";
import { DateSegment, DATE_SEGMENT } from "./types";

type GetDateSegmentValues = (
  originalValues: {
    year?: string;
    month?: string;
    day?: string;
  },
  show: Array<DateSegment>,
) => string | undefined;

const getSegmentValues: GetDateSegmentValues = ({ year, month, day }, show) => {
  // If we are not showing year, just set it to the current year
  const newYear = show.includes(DATE_SEGMENT.Year)
    ? year
    : format(new Date(), "yyyy");
  // If we are not showing month or day, set it to the first
  const newMonth = show.includes(DATE_SEGMENT.Month) ? month : "01";
  const newDay = show.includes(DATE_SEGMENT.Day) ? day : "01";

  let values: string[] = [];
  if (newYear) {
    values = [...values, newYear];
  }
  if (newMonth) {
    values = [...values, newMonth];
  }
  if (newDay) {
    values = [...values, newDay];
  }

  return values.join("-");
};

export default getSegmentValues;
