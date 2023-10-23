import React from "react";
import { useIntl } from "react-intl";
import { FieldErrors, FieldValues, useFormState } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import {
  Alert,
  ScrollToLink,
  ScrollLinkClickFunc,
  Link,
} from "@gc-digital-talent/ui";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import type { FieldLabels } from "./BasicForm";

/**
 * Flatten Errors
 *
 * Recursively takes the the errors produced by `useFormState`
 * and flattens them to an array of the field names.
 *
 * @param {FieldErrors<FieldValues> } errors - from form state
 * @param {string} parent - The field name of an existing parent
 * @returns {string[]}
 */
const flattenErrors = (
  errors: FieldErrors<FieldValues>,
  parent?: string,
): string[] => {
  let errorNames: string[] = [];
  const parentKey = parent ? `${parent}.` : "";

  Object.keys(errors).forEach((fieldName) => {
    const fieldError = errors[fieldName];
    if (fieldError) {
      // This is a root of a field array, so add it to the key so we are aware later
      if ("root" in fieldError) {
        errorNames = [...errorNames, `${fieldName}.root`];
      }
      // If it is a field array, loop through, hoisting up field names
      if (Array.isArray(fieldError)) {
        fieldError.forEach((subFieldError, index) => {
          errorNames = [
            ...errorNames,
            ...flattenErrors(
              subFieldError,
              `${parentKey}${fieldName}.${index}`,
            ),
          ];
        });
      }
      // We have an error message so add it to the array (we don't want errors with no message)
      if ("message" in fieldError) {
        errorNames = [...errorNames, `${parentKey}${fieldName}`];
      }
    }
  });

  return errorNames;
};

type FieldNameWithLabel = {
  label: React.ReactNode;
  name: string;
  index?: number;
};

const numberRegex = /\d/g;

/**
 * Get Field Label
 *
 * User the field name to extract the associated label
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
  let index: undefined | number;

  // This is a root error for a field array
  if (name.includes(".root")) {
    labelKey = name.replace(".root", "");
  } else if (numberRegex.test(name)) {
    // If a number exists in the field name, replace it with an asterisk
    labelKey = name.replace(numberRegex, "*");
    // Get the number and assign it to the index so we can show it in the link
    const indices = numberRegex.exec(name);
    if (indices) {
      const [nestedIndex] = indices;
      index = Number(nestedIndex);
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
  const { errors } = useFormState();

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
    <Alert.Root type="error" ref={forwardedRef} tabIndex={-1}>
      <Alert.Title>
        {intl.formatMessage(errorMessages.summaryTitle)}
      </Alert.Title>
      <p>{intl.formatMessage(errorMessages.summaryDescription)}</p>
      <ul data-h2-margin="base(x.5, 0, 0, 0)">
        {invalidFieldNames.map((field) => {
          const fieldIndex = notEmpty(field.index) ? field.index + 1 : null;
          return (
            <li key={field.name}>
              <ScrollToLink
                to={field.name}
                onScrollTo={handleErrorClick}
                mode="text"
                color="error"
              >
                {field.label}
                {fieldIndex ? ` (${fieldIndex})` : null}
              </ScrollToLink>
              {intl.formatMessage(commonMessages.dividingColon)}
              <ErrorMessage name={field.name} />
            </li>
          );
        })}
      </ul>
      <Alert.Footer>
        <p>{intl.formatMessage(errorMessages.summaryContact, { a })}</p>
      </Alert.Footer>
    </Alert.Root>
  ) : null;
});

export default ErrorSummary;
