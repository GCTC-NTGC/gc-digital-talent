import React from "react";
import { useIntl } from "react-intl";
import { useFormState } from "react-hook-form";

import type { FieldLabels } from "./BasicForm";

import Alert from "../Alert";
import { ScrollToLink } from "../Link";
import { notEmpty } from "../../helpers/util";

interface UnsavedChangesProps {
  labels?: FieldLabels;
}

const UnsavedChanges = ({ labels }: UnsavedChangesProps) => {
  const intl = useIntl();
  const { isDirty, dirtyFields } = useFormState();

  // Don't show if the form is clean
  if (!isDirty) return null;

  const unsavedFields = Object.keys(dirtyFields)
    .map((field) => {
      /**
       * Some forms are adding keys for dirtyFields
       * when they are not dirty so make sure the value
       * of each key is true.
       */
      const fieldDirty = dirtyFields[field];
      if (labels && field in labels && fieldDirty) {
        return {
          name: field,
          label: labels[field],
        };
      }

      return undefined;
    })
    .filter(notEmpty);

  return unsavedFields.length > 0 ? (
    <Alert
      type="info"
      title={intl.formatMessage({
        defaultMessage: "You have unsaved changes",
        id: "9hjEsr",
        description: "Title for unsaved changes warning on profile forms",
      })}
    >
      <ul data-h2-margin="base(x.5, 0, 0, 0)">
        {unsavedFields.map((field) => (
          <li key={field.name}>
            <ScrollToLink to={field.name}>{field.label}</ScrollToLink>
          </li>
        ))}
      </ul>
    </Alert>
  ) : null;
};

export default UnsavedChanges;
