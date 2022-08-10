import { defineMessages } from "react-intl";

const messages = defineMessages({
  required: {
    // These errors must be passed to react-hook-form as error messages, and it only expects strings.
    // However, when we use rich text elements like `<hidden>`, formatMessage will return ReactNode.
    // For this reason, we can't use rich text elements in these error messages, only simple values.
    //
    // This was the case despite indications that feeding it ReactNode as a message should work:
    // https://github.com/react-hook-form/react-hook-form/discussions/8401#discussioncomment-2819633
    defaultMessage: "This field is required.",
    description:
      "Error message that this field must filled for the form to be valid.",
  },
  telephone: {
    defaultMessage: "This field must follow the pattern +123243234.",
    description:
      "Error message that the field must contain a phone number validated by the specified pattern.",
  },
  futureDate: {
    defaultMessage: "This field must use future dates only.",
    description: "Error message that the provided date must be in the future.",
  },
  mustBeGreater: {
    defaultMessage: "Value must be greater than {value}.",
    description:
      "Error message that the provided value must be greater than some referenced minimum value.",
  },
  dateMustFollow: {
    defaultMessage: "Date must not be before {value}.",
    description:
      "Error message that the date provided must follow and not precede some referenced date",
  },
  overWordLimit: {
    defaultMessage: "This field must have less than {value} words.",
    description:
      "Error Message displayed on word counter when user passes the limit.",
  },
});

export default messages;
