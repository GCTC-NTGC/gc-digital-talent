import { useIntl } from "react-intl";
import { FieldErrors, FieldValues, useFormState } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { ReactNode, forwardRef, ComponentRef } from "react";

import {
  Notice,
  ScrollToLink,
  ScrollLinkClickFunc,
  Link,
  Ul,
} from "@gc-digital-talent/ui";
import {
  commonMessages,
  errorMessages,
  getLocale,
} from "@gc-digital-talent/i18n";

import type { FieldLabels } from "../types";
import { flattenErrors } from "../utils";
import { useFormLabels } from "./FormLabelsProvider";

interface FieldNameWithLabel {
  label: ReactNode;
  name: string;
  index?: string;
}

const numberRegex = /(\d+)/g;

/**
 * Get Field Label
 *
 * Use the field name to extract the associated label
 *
 * @param {string} name - The name property of the field
 * @param {FieldLabels} labels - Available labels
 * @returns {FieldNameWithLabel | null}
 */
const getFieldLabel = (
  name: string,
  labels: FieldLabels,
): FieldNameWithLabel | null => {
  let labelKey = name;
  let index: undefined | string;

  // This is a root error for a field array
  if (name.includes(".root")) {
    labelKey = name.replace(".root", "");
  } else if (numberRegex.test(name)) {
    // If a number exists in the field name, replace it with an asterisk
    labelKey = name.replace(numberRegex, "*");
    // Get the number and assign it to the index so we can show it in the link
    const indices = name.match(numberRegex);
    if (indices) {
      index = indices.map((i) => ` (${Number(i) + 1})`).join(" ");
    }
  }

  if (labelKey in labels) {
    return {
      name,
      index,
      label: labels[labelKey],
    };
  }

  return null;
};

/**
 * Add labels to errors
 *
 * Transform the errors to associate them with labels
 * so they can be used as the link name
 *
 * @param {FieldErrors<FieldValues> } errors - from form state
 * @param {FieldLabels} labels - Available labels
 * @returns {FieldNameWithLabel}
 */
const addLabelsToErrors = (
  errors: FieldErrors<FieldValues>,
  labels: FieldLabels,
): FieldNameWithLabel[] => {
  const invalidFieldNames = flattenErrors(errors);
  let fieldNamesWithLabels: FieldNameWithLabel[] = [];

  invalidFieldNames.forEach((fieldName) => {
    const fieldNameWithLabel = getFieldLabel(fieldName, labels);
    if (fieldNameWithLabel) {
      fieldNamesWithLabels = [...fieldNamesWithLabels, fieldNameWithLabel];
    }
  });

  return fieldNamesWithLabels;
};

interface ErrorSummaryProps {
  labels?: FieldLabels;
  show: boolean;
}

const supportLink = (chunks: ReactNode, locale: string) => (
  <Link
    href={`/${locale}/support`}
    state={{ referrer: window.location.href }}
    newTab
    color="error"
  >
    {chunks}
  </Link>
);

const ErrorSummary = forwardRef<ComponentRef<"div">, ErrorSummaryProps>(
  ({ labels: labelsProp, show }, forwardedRef) => {
    const intl = useIntl();
    const locale = getLocale(intl);
    const { errors } = useFormState();
    const { labels: registeredLabels } = useFormLabels();
    const labels = { ...registeredLabels, ...labelsProp };

    // Don't show if the form is valid
    if (!errors || !show || !labels) return null;

    // Flatten the error object and get the label
    const invalidFieldNames = addLabelsToErrors(errors, labels);

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

    return invalidFieldNames.length > 0 ? (
      <Notice.Root
        color="error"
        mode="inline"
        role="alert"
        ref={forwardedRef}
        tabIndex={-1}
        className="mb-6"
      >
        <Notice.Title defaultIcon>
          {intl.formatMessage(errorMessages.summaryTitle)}
        </Notice.Title>
        <Notice.Content>
          <p>{intl.formatMessage(errorMessages.summaryDescription)}</p>
          <Ul className="mt-3">
            {invalidFieldNames.map((field) => {
              return (
                <li key={field.name}>
                  <ScrollToLink
                    to={field.name}
                    onScrollTo={handleErrorClick}
                    mode="text"
                    color="error"
                  >
                    {field.label}
                    {field.index ?? <span className="ml-1">{field.index}</span>}
                  </ScrollToLink>
                  {intl.formatMessage(commonMessages.dividingColon)}
                  <ErrorMessage name={field.name} />
                </li>
              );
            })}
          </Ul>
        </Notice.Content>
        <Notice.Footer>
          <p>
            {intl.formatMessage(errorMessages.summaryContact, {
              a: (chunks: ReactNode) => supportLink(chunks, locale),
            })}
          </p>
        </Notice.Footer>
      </Notice.Root>
    ) : null;
  },
);

export default ErrorSummary;
