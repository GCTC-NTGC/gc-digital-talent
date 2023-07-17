import React from "react";
import { useIntl } from "react-intl";
import { useFormState } from "react-hook-form";

import {
  Alert,
  ScrollToLink,
  ScrollLinkClickFunc,
  Link,
} from "@gc-digital-talent/ui";
import { errorMessages, getLocale } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import type { FieldLabels } from "./BasicForm";

interface ErrorSummaryProps {
  labels?: FieldLabels;
  show: boolean;
}

const a = (chunks: React.ReactNode) => (
  <Link external href="mailto:gctalent-talentgc@support-soutien.gc.ca">
    {chunks}
  </Link>
);

const ErrorSummary = React.forwardRef<
  React.ElementRef<"div">,
  ErrorSummaryProps
>(({ labels, show }, forwardedRef) => {
  const intl = useIntl();

  const locale = getLocale(intl);
  const { errors } = useFormState();

  // Don't show if the form is valid
  if (!errors || !show) return null;

  const invalidFields = Object.keys(errors)
    .map((field) => {
      /**
       * Massages the errors to a human readable
       * format as well as displaying generic
       * error message when one is not provided.
       */
      const fieldInvalid = errors[field];
      if (labels && field in labels && fieldInvalid) {
        return {
          name: field,
          label: labels[field],
          message:
            fieldInvalid?.message || intl.formatMessage(errorMessages.unknown),
        };
      }

      return undefined;
    })
    .filter(notEmpty);

  const handleErrorClick: ScrollLinkClickFunc = (e, target) => {
    e.preventDefault();
    const singleInputTypes = ["input", "select", "textarea"];
    if (target) {
      // The input is not part of a group so just focus it directly
      if (singleInputTypes.includes(target.nodeName.toLocaleLowerCase())) {
        target.focus();
      } else {
        // Find the input in a RadioGroup or CheckList and focus it
        target.querySelector("input")?.focus();
      }
    }
  };

  return invalidFields.length > 0 ? (
    <Alert.Root type="error" ref={forwardedRef} tabIndex={-1}>
      <Alert.Title>
        {intl.formatMessage(errorMessages.summaryTitle)}
      </Alert.Title>
      <p>{intl.formatMessage(errorMessages.summaryDescription)}</p>
      <ul data-h2-margin="base(x.5, 0, 0, 0)">
        {invalidFields.map((field) => (
          <li key={field.name}>
            <ScrollToLink to={field.name} onScrollTo={handleErrorClick}>
              {field.label}
            </ScrollToLink>
            {`${locale === "fr" ? ` : ` : `: `}${field.message}`}
          </li>
        ))}
      </ul>
      <Alert.Footer>
        <p>{intl.formatMessage(errorMessages.summaryContact, { a })}</p>
      </Alert.Footer>
    </Alert.Root>
  ) : null;
});

export default ErrorSummary;
