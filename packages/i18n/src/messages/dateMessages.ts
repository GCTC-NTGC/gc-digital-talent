import { defineMessage } from "react-intl";

const dateMessages = {
  year: defineMessage({
    defaultMessage: "Year",
    id: "iSfiWx",
    description: "Label for a year input field",
  }),
  month: defineMessage({
    defaultMessage: "Month",
    id: "L05/+D",
    description: "Label for a month input field",
  }),
  day: defineMessage({
    defaultMessage: "Day",
    id: "a5edSg",
    description: "Label for a day of the month input field",
  }),
  selectAMonth: defineMessage({
    defaultMessage: "Select a month",
    id: "5hXz/z",
    description: "Placeholder for a month select field",
  }),
  january: defineMessage({
    defaultMessage: "January",
    id: "yHeFkO",
    description: "Name of the first month",
  }),
  february: defineMessage({
    defaultMessage: "February",
    id: "xNESdj",
    description: "Name of the second month",
  }),
  march: defineMessage({
    defaultMessage: "March",
    id: "x61BXA",
    description: "Name of the third month",
  }),
  april: defineMessage({
    defaultMessage: "April",
    id: "fAj9+G",
    description: "Name of the fourth month",
  }),
  may: defineMessage({
    defaultMessage: "May",
    id: "zXRf0L",
    description: "Name of the fifth month",
  }),
  june: defineMessage({
    defaultMessage: "June",
    id: "1Wq7Pf",
    description: "Name of the sixth month",
  }),
  july: defineMessage({
    defaultMessage: "July",
    id: "n+SiHy",
    description: "Name of the seventh month",
  }),
  august: defineMessage({
    defaultMessage: "August",
    id: "ldthVj",
    description: "Name of the eighth month",
  }),
  september: defineMessage({
    defaultMessage: "September",
    id: "6tekaa",
    description: "Name of the ninth month",
  }),
  october: defineMessage({
    defaultMessage: "October",
    id: "/EWDdn",
    description: "Name of the tenth month",
  }),
  november: defineMessage({
    defaultMessage: "November",
    id: "rCXko4",
    description: "Name of the eleventh month",
  }),
  december: defineMessage({
    defaultMessage: "December",
    id: "y4oBW4",
    description: "Name of the twelfth month",
  }),
  yearPlaceholder: defineMessage({
    defaultMessage: "YYYY",
    id: "4MKYKl",
    description: "Placeholder for a year input",
  }),
  dayPlaceholder: defineMessage({
    defaultMessage: "DD",
    id: "T5b8Q7",
    description: "Placeholder for a day input",
  }),
  deadlinePassed: defineMessage({
    defaultMessage: "The deadline for submission has passed.",
    id: "8WC+Ty",
    description: "Message displayed when a closing date has passed.",
  }),
  deadlineToday: defineMessage<{ time: string }>({
    defaultMessage: "Closes today at {time}",
    id: "jy7itR",
    description: "Text displayed when relative date is today.",
  }),
  deadlineTomorrow: defineMessage<{ time: string }>({
    defaultMessage: "Closes tomorrow at {time}",
    id: "GqmxO8",
    description: "Text displayed when relative date is tomorrow.",
  }),
};

export default dateMessages;
