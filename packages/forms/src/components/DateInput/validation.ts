import { isAfter, isValid, isEqual, isBefore } from "date-fns";
import { IntlShape } from "react-intl";
import { FieldValues, Validate } from "react-hook-form";

import {
  formatDate,
  formDateStringToDate,
} from "@gc-digital-talent/date-helpers";
import { errorMessages } from "@gc-digital-talent/i18n";

import { DateConstraint } from "./types";

const getDateValidation = (
  constraints: DateConstraint,
  name: string,
  required: boolean,
  currentValues: {
    year?: string;
    month?: string;
    day?: string;
  },
  intl: IntlShape,
) => {
  // Note: This comes from `react-hook-form`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let validation: Validate<any> | Record<string, Validate<any>> | undefined = {
    isDate: (value: string) => {
      const isOptionAndEmpty =
        !required &&
        !currentValues.year &&
        !currentValues.month &&
        !currentValues.day;

      return (
        isValid(formDateStringToDate(value)) ||
        isOptionAndEmpty ||
        intl.formatMessage(errorMessages.invalidDate)
      );
    },
  };

  if (constraints.min) {
    validation = {
      ...validation,
      isAfterMin: (value: string) => {
        if (!constraints.min) {
          return true;
        }
        const parsedDate = formDateStringToDate(value);
        return (
          isAfter(parsedDate, constraints.min) ||
          isEqual(parsedDate, constraints.min) ||
          intl.formatMessage(errorMessages.minDate, {
            date: formatDate({
              date: constraints.min,
              formatString: "yyyy-MM-dd",
              intl,
            }),
          })
        );
      },
    };
  }
  if (constraints.max) {
    validation = {
      ...validation,
      isBeforeMax: (value: string) => {
        if (!constraints.max) {
          return true;
        }
        const parsedDate = formDateStringToDate(value);
        return (
          isBefore(parsedDate, constraints.max) ||
          isEqual(parsedDate, constraints.max) ||
          intl.formatMessage(errorMessages.maxDate, {
            date: formatDate({
              date: constraints.max,
              formatString: "yyyy-MM-dd",
              intl,
            }),
          })
        );
      },
    };
  }

  return validation;
};

export default getDateValidation;
