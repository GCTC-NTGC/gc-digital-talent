import React from "react";
import { useFormState } from "react-hook-form";

export const Submit: React.FunctionComponent<{
  text?: string;
  notDirtyText?: string;
  isSubmittingText?: string;
}> = ({ text, notDirtyText, isSubmittingText }) => {
  const _text = text ?? "Submit";
  const _notDirtyText = notDirtyText ?? "Submitted";
  const _isSubmittingText = isSubmittingText ?? "Submitting";
  const { isDirty, isSubmitting } = useFormState();

  const currentText = isSubmitting
    ? _isSubmittingText
    : !isDirty
    ? _notDirtyText
    : _text;

  return (
    <button type="submit" disabled={isSubmitting || !isDirty}>
      {currentText}
    </button>
  );
};

export default Submit;
