import React from "react";
import { useFormState } from "react-hook-form";
import { Button } from "../..";

export const Submit: React.FunctionComponent<{
  text?: string;
  notDirtyText?: string;
  isSubmittingText?: string;
  color?: "primary" | "secondary" | "cta" | "white";
  mode?: "solid" | "outline" | "inline";
}> = ({ text, notDirtyText, isSubmittingText, color, mode }) => {
  const defaultText = "Submit";
  const defaultNotDirtyText = "Submitted";
  const defaultIsSubmittingText = "Submitting";

  const { isDirty, isSubmitting, isSubmitted } = useFormState();
  let currentText = text ?? defaultText;
  if (isSubmitting) {
    currentText = isSubmittingText ?? defaultIsSubmittingText;
  } else if (!isDirty && isSubmitted) {
    currentText = notDirtyText ?? defaultNotDirtyText;
  }

  return (
    <Button
      color={color || "primary"}
      mode={mode || "solid"}
      type="submit"
      disabled={isSubmitting || !isDirty}
    >
      {currentText}
    </Button>
  );
};

export default Submit;
