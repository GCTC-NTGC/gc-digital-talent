import React from "react";
import { useFormState } from "react-hook-form";

export const Submit: React.FunctionComponent<{
  text?: string;
  notDirtyText?: string;
  isSubmittingText?: string;
}> = ({ text, notDirtyText, isSubmittingText }) => {
  const defaultText = "Submit";
  const defaultNotDirtyText = "Submitted";
  const defaultIsSubmittingText = "Submitting";

  const { isDirty, isSubmitting } = useFormState();
  let currentText = text ?? defaultText;
  if (isSubmitting) {
    currentText = isSubmittingText ?? defaultIsSubmittingText;
  } else if (!isDirty) {
    currentText = notDirtyText ?? defaultNotDirtyText;
  }

  return (
    <button type="submit" disabled={isSubmitting || !isDirty}>
      {currentText}
    </button>
  );
};

export default Submit;
