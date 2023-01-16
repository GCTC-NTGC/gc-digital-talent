import React from "react";
import { useIntl } from "react-intl";
import { useFormState } from "react-hook-form";

import type { FieldLabels } from "./BasicForm";

import Alert from "../Alert";
import { ScrollToLink } from "../Link";
import { getLocale } from "../../helpers/localize";
import { notEmpty } from "../../helpers/util";

interface ErrorSummaryProps {
  labels?: FieldLabels;
  show: boolean;
}

const a = (chunks: React.ReactNode) => (
  <a href="mailto:gctalent-talentgc@support-soutien.gc.ca">{chunks}</a>
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
            fieldInvalid?.message ||
            intl.formatMessage({
              defaultMessage: "Unknown error",
              id: "iqD8qE",
              description:
                "Fallback text when an error message is not supplied",
            }),
        };
      }

      return undefined;
    })
    .filter(notEmpty);

  return invalidFields.length > 0 ? (
    <Alert.Root type="error" ref={forwardedRef} tabIndex={0}>
      <Alert.Title>
        {intl.formatMessage({
          defaultMessage: "Oops, you have some errors!",
          id: "xAxxmc",
          description: "Title for error summary on profile forms",
        })}
      </Alert.Title>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "The following error(s) must be fixed before submitting the form:",
          id: "IlPyP8",
          description: "Message indicating which errors the form has",
        })}
      </p>
      <ul data-h2-margin="base(x.5, 0, 0, 0)">
        {invalidFields.map((field) => (
          <li key={field.name}>
            <ScrollToLink to={field.name}>{field.label}</ScrollToLink>
            {`${locale === "fr" ? ` : ` : `: `}${field.message}`}
          </li>
        ))}
      </ul>
      <Alert.Footer>
        <p>
          {intl.formatMessage(
            {
              defaultMessage:
                "<a>Reach out to our support team</a> if you have any questions.",
              id: "sVsZmT",
              description:
                "Telling users to email support team with any questions about errors",
            },
            { a },
          )}
        </p>
      </Alert.Footer>
    </Alert.Root>
  ) : null;
});

export default ErrorSummary;
