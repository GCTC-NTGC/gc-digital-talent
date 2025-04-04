import { defineMessages } from "react-intl";

const errorMessages = defineMessages({
  error: {
    defaultMessage: "Error",
    id: "ra+8d1",
    description: "Generic error message",
  },
  required: {
    // These errors must be passed to react-hook-form as error messages, and it only expects strings.
    // However, when we use rich text elements like `<hidden>`, formatMessage will return ReactNode.
    // For this reason, we can't use rich text elements in these error messages, only simple values.
    //
    // This was the case despite indications that feeding it ReactNode as a message should work:
    // https://github.com/react-hook-form/react-hook-form/discussions/8401#discussioncomment-2819633
    defaultMessage: "This field is required. Please enter a value.",
    id: "JqjYZq",
    description:
      "Error message that this field must filled for the form to be valid.",
  },
  telephone: {
    defaultMessage: "This field must follow the pattern +123243234.",
    id: "adbcoS",
    description:
      "Error message that the field must contain a phone number validated by the specified pattern.",
  },
  futureDate: {
    defaultMessage: "This field must use future dates only.",
    id: "ZhQEUx",
    description: "Error message that the provided date must be in the future.",
  },
  mustNotBeFuture: {
    defaultMessage: "This field cannot use dates in the future.",
    id: "v6T4Y0",
    description: "Error message that the date cannot be in the future.",
  },
  mustBeGreater: {
    defaultMessage: "Value must be greater than {value}.",
    id: "5gS1sZ",
    description:
      "Error message that the provided value must be greater than some referenced minimum value.",
  },
  dateMustFollow: {
    defaultMessage: "Date must not be before {value}.",
    id: "RkxqoB",
    description:
      "Error message that the date provided must follow and not precede some referenced date",
  },
  overWordLimit: {
    defaultMessage: "This field must have less than {value} words.",
    id: "z7UVe6",
    description:
      "Error Message displayed on word counter when user passes the limit.",
  },
  overCharacterLimit: {
    defaultMessage: "This field must have less than {value} characters.",
    id: "GiYTD4",
    description:
      "Error Message displayed when the user passes some given character or letter limit.",
  },
  unknownErrorRequestErrorTitle: {
    defaultMessage: "Sorry, we encountered an error.",
    id: "edeLyW",
    description: "Title for the unexpected error page.",
  },
  unknownErrorRequestErrorBody: {
    defaultMessage:
      "We have encountered an unknown error while processing your request.",
    id: "quLfED",
    description: "Body text for the unexpected error page.",
  },
  unknown: {
    defaultMessage: "Unknown error",
    id: "iqD8qE",
    description: "Fallback text when an error message is not supplied",
  },
  summaryTitle: {
    defaultMessage: "Oops, you have some errors!",
    id: "xAxxmc",
    description: "Title for error summary on profile forms",
  },
  summaryDescription: {
    defaultMessage:
      "The following error(s) must be fixed before submitting the form:",
    id: "IlPyP8",
    description: "Message indicating which errors the form has",
  },
  summaryContact: {
    defaultMessage:
      "<a>Reach out to our support team</a> if you have any questions.",
    id: "sVsZmT",
    description:
      "Telling users to email support team with any questions about errors",
  },
  invalidDate: {
    defaultMessage: "Please enter a valid date",
    id: "WhXfSx",
    description:
      "Error message that appears when a user enters an invalid date into a date input",
  },
  minDate: {
    defaultMessage: "The date must be after or equal to {date}",
    id: "oR0evm",
    description:
      "Error message when a date was entered that is less than the minimum required",
  },
  maxDate: {
    defaultMessage: "The date must be before or equal to {date}",
    id: "PMwqcS",
    description:
      "Error message when a date was entered that is greater than the maximum required",
  },
  requestRejected: {
    defaultMessage:
      "Your request wasn't completed. Please try again or contact our team for help.",
    id: "Gv3lBS",
    description: "Message for Unauthorized or Request Rejected server response",
  },
  downloadRequestFailed: {
    defaultMessage:
      "There was a problem downloading your file. If you continue to receive this error, please get in touch with our support team.",
    id: "DIK7Z1",
    description: "Message for when the download request failed",
  },
  downloadingFileFailed: {
    defaultMessage:
      "There was a problem on our end. {fileName} failed to download. If you continue to receive this error, please get in touch with our support team.",
    id: "EW8RHQ",
    description: "Error message when a file download fails",
  },
  notGovernmentEmail: {
    defaultMessage:
      "This doesn't appear to be a valid Government of Canada email address. Please double check it or reach out to support if you think this is an error.",
    id: "xUhyIU",
    description: "Description for rule pattern on work email field",
  },
});

export default errorMessages;
