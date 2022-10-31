import React from "react";
import { useIntl } from "react-intl";
import { useFormState } from "react-hook-form";

import type { FieldLabels } from "./BasicForm";

import Alert from "../Alert";
import { ScrollToLink } from "../Link";
import { notEmpty } from "../../helpers/util";

const Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 86 86"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="10"
      d="M43 30.5v15.625M80.5 43c0 20.71-16.79 37.5-37.5 37.5S5.5 63.71 5.5 43 22.29 5.5 43 5.5 80.5 22.29 80.5 43zM43 58.625h.031v.031H43v-.031z"
    />
  </svg>
);

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
      icon={Icon}
      type="info"
      mode="large"
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
