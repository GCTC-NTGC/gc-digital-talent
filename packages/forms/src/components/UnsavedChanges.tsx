import { useIntl } from "react-intl";
import { useFormState } from "react-hook-form";

import { Alert, ScrollToLink, Ul } from "@gc-digital-talent/ui";
import { formMessages } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import type { FieldLabels } from "../types";

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
      const fieldDirty = Boolean(dirtyFields[field]);
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
      <Alert.Title>{intl.formatMessage(formMessages.unsavedTitle)}</Alert.Title>
      <Ul className="mt-3">
        {unsavedFields.map((field) => (
          <li key={field.name}>
            <ScrollToLink to={field.name} mode="text" color="black">
              {field.label}
            </ScrollToLink>
          </li>
        ))}
      </Ul>
    </Alert.Root>
  ) : null;
};

export default UnsavedChanges;
