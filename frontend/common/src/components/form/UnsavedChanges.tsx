import React from "react";
import { useIntl } from "react-intl";
import { useFormState } from "react-hook-form";

import type { FieldLabels } from "./BasicForm";

import Alert from "../Alert";
import { ScrollToLink } from "../Link";
import { notEmpty } from "../../helpers/util";

interface UnsavedChangesProps {
  labels?: FieldLabels;
  show: boolean;
  onDismiss: () => void;
}

const UnsavedChanges = ({ labels, onDismiss, show }: UnsavedChangesProps) => {
  const intl = useIntl();
  const { isDirty, dirtyFields, errors } = useFormState();

  // Don't show if the form is clean
  if (!isDirty || !show) return null;

  const unsavedFields = Object.keys(dirtyFields)
    .map((field) => {
      /**
       * Some forms are adding keys for dirtyFields
       * when they are not dirty so make sure the value
       * of each key is true.
       *
       * Also checks if the field has errors, since we cannot
       * save invalid fields, we prefer error message over
       * the unsaved message
       */
      const fieldDirty = dirtyFields[field];
      const fieldInvalid = errors[field];
      if (labels && field in labels && fieldDirty && !fieldInvalid) {
        return {
          name: field,
          label: labels[field],
        };
      }

      return undefined;
    })
    .filter(notEmpty);

  return unsavedFields.length > 0 ? (
    <Alert.Root type="info" dismissible onDismiss={onDismiss}>
      <Alert.Title>
        {intl.formatMessage({
          defaultMessage: "You have unsaved changes",
          id: "9hjEsr",
          description: "Title for unsaved changes warning on profile forms",
        })}
      </Alert.Title>
      <ul data-h2-margin="base(x.5, 0, 0, 0)">
        {unsavedFields.map((field) => (
          <li key={field.name}>
            <ScrollToLink to={field.name}>{field.label}</ScrollToLink>
          </li>
        ))}
      </ul>
    </Alert.Root>
  ) : null;
};

export default UnsavedChanges;
