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

  return `${newYear}-${newMonth}-${newDay}`;
};

export default getSegmentValues;
