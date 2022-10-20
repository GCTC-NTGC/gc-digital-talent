import React from "react";
import { useIntl } from "react-intl";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useFormState } from "react-hook-form";

import type { FieldLabels } from "./BasicForm";

import Alert from "../Alert";
import { ScrollToLink } from "../Link";

interface UnsavedChangesProps {
  labels?: FieldLabels;
}

const UnsavedChanges = ({ labels }: UnsavedChangesProps) => {
  const intl = useIntl();
  const { isDirty, dirtyFields } = useFormState();

  // Don;t show if the form is clean
  if (!isDirty) return null;

  return (
    <Alert
      icon={ExclamationTriangleIcon}
      type="info"
      title={intl.formatMessage({
        defaultMessage: "You have unsaved changes",
        id: "9hjEsr",
        description: "Title for unsaved changes warning on profile forms",
      })}
    >
      <ul data-h2-margin="base(x.5, 0, 0, 0)">
        {Object.keys(dirtyFields).map((field) => (
          <li key={field}>
            <ScrollToLink to={field}>
              {labels ? labels[field] : field}
            </ScrollToLink>
          </li>
        ))}
      </ul>
    </Alert>
  );
};

export default UnsavedChanges;
