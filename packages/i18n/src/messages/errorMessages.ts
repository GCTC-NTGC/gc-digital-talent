import { defineMessage, type MessageTag, type PrimitiveType } from "react-intl";

const errorMessages = {
  error: defineMessage({
    defaultMessage: "Error",
    id: "ra+8d1",
    description: "Generic error message",
  }),
  required: defineMessage({
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
  }),
  futureDate: defineMessage({
    defaultMessage: "This field must use future dates only.",
    id: "ZhQEUx",
    description: "Error message that the provided date must be in the future.",
  }),
  mustNotBeFutureStartDate: defineMessage({
    defaultMessage:
      "The start date can’t be in the future. Enter a date in the past.",
    id: "5Skje0",
    description: "Error message that the start date cannot be in the future.",
  }),
  mustNotBeFutureAwardedDate: defineMessage({
    defaultMessage:
      "The date awarded can’t be in the future. Enter a date in the past.",
    id: "gCsa4y",
    description: "Error message that the awarded date cannot be in the future.",
  }),
  mustNotBeFutureEndDate: defineMessage({
    defaultMessage:
      "The end date can’t be in the future. Enter a date in the past or select that this is your current role.",
    id: "uQq6qZ",
    description: "Error message that the end date cannot be in the future.",
  }),
  mustNotBeFutureIssueDate: defineMessage({
    defaultMessage:
      "The issue date can't be in the future. Enter a date in the past.",
    id: "pdT/ln",
    description: "Error message that the end date cannot be in the future.",
  }),
  mustNotBePastExpiryDate: defineMessage({
    defaultMessage:
      "The expiry date can’t be in the past. Enter a date in the future.",
    id: "V9HdOK",
    description: "Error message that the expiry date cannot be in the past.",
  }),
  mustNotBePastPriorityDate: defineMessage({
    defaultMessage:
      "The priority status expiration date can’t be in the past. Enter a date in the future.",
    id: "Kvidd3",
    description:
      "Error message that the priority status date cannot be in the past.",
  }),
  mustNotBePastVeteranDate: defineMessage({
    defaultMessage:
      "The veteran status expiration date can’t be in the past. Enter a date in the future.",
    id: "NCQBQz",
    description:
      "Error message that the veteran status date cannot be in the past.",
  }),
  mustBeGreater: defineMessage<{ value: PrimitiveType }>({
    defaultMessage: "Value must be greater than {value}.",
    id: "5gS1sZ",
    description:
      "Error message that the provided value must be greater than some referenced minimum value.",
  }),
  overWordLimit: defineMessage<{ value: number }>({
    defaultMessage: "This field must have less than {value} words.",
    id: "z7UVe6",
    description:
      "Error Message displayed on word counter when user passes the limit.",
  }),
  overCharacterLimit: defineMessage<{ value: number }>({
    defaultMessage: "This field must have less than {value} characters.",
    id: "GiYTD4",
    description:
      "Error Message displayed when the user passes some given character or letter limit.",
  }),
  unknownErrorRequestErrorTitle: defineMessage({
    defaultMessage: "Sorry, we encountered an error.",
    id: "edeLyW",
    description: "Title for the unexpected error page.",
  }),
  unknownErrorRequestErrorBody: defineMessage({
    defaultMessage:
      "We have encountered an unknown error while processing your request.",
    id: "quLfED",
    description: "Body text for the unexpected error page.",
  }),
  unknown: defineMessage({
    defaultMessage: "Unknown error",
    id: "iqD8qE",
    description: "Fallback text when an error message is not supplied",
  }),
  summaryTitle: defineMessage({
    defaultMessage: "Oops, you have some errors!",
    id: "xAxxmc",
    description: "Title for error summary on profile forms",
  }),
  summaryDescription: defineMessage({
    defaultMessage:
      "The following error(s) must be fixed before submitting the form:",
    id: "IlPyP8",
    description: "Message indicating which errors the form has",
  }),
  summaryContact: defineMessage<{ a: MessageTag }>({
    defaultMessage:
      "<a>Reach out to our support team</a> if you have any questions.",
    id: "sVsZmT",
    description:
      "Telling users to email support team with any questions about errors",
  }),
  invalidDate: defineMessage({
    defaultMessage: "Please enter a valid date",
    id: "WhXfSx",
    description:
      "Error message that appears when a user enters an invalid date into a date input",
  }),
  maxDate: defineMessage<{ date: number }>({
    defaultMessage: "The date must be before or equal to {date}",
    id: "PMwqcS",
    description:
      "Error message when a date was entered that is greater than the maximum required",
  }),
  minDateLabel: defineMessage<{ label: string }>({
    defaultMessage: "The date must be after or equal to the {label}.",
    id: "wfkOXt",
    description:
      "Error message when a date was entered that is less than the minimum required, referencing an associated input label",
  }),
  minDateSelfLabel: defineMessage<{
    labelSelf: string;
    labelAssociated: string;
  }>({
    defaultMessage:
      "The {labelSelf} must be after or equal to the {labelAssociated}.",
    id: "SsBPWB",
    description:
      "Error message when a date was entered that is less than the minimum required, referencing itself and an associated input label",
  }),
  requestRejected: defineMessage({
    defaultMessage:
      "Your request wasn't completed. Please try again or contact our team for help.",
    id: "Gv3lBS",
    description: "Message for Unauthorized or Request Rejected server response",
  }),
  downloadRequestFailed: defineMessage({
    defaultMessage:
      "There was a problem downloading your file. If you continue to receive this error, please get in touch with our support team.",
    id: "DIK7Z1",
    description: "Message for when the download request failed",
  }),
  downloadingFileFailed: defineMessage<{ fileName: PrimitiveType }>({
    defaultMessage:
      "There was a problem on our end. {fileName} failed to download. If you continue to receive this error, please get in touch with our support team.",
    id: "EW8RHQ",
    description: "Error message when a file download fails",
  }),
  notGovernmentEmail: defineMessage({
    defaultMessage:
      "This doesn't appear to be a valid Government of Canada email address. Please double check it or reach out to support if you think this is an error.",
    id: "xUhyIU",
    description: "Description for rule pattern on work email field",
  }),
};

export default errorMessages;
