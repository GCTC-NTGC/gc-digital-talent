import React from "react";
import { useFormState } from "react-hook-form";
import { Button } from "../..";

export const Submit: React.FunctionComponent<{
  text?: string;
  submittedText?: string;
  isSubmittingText?: string;
  color?: "primary" | "secondary" | "cta" | "white";
  mode?: "solid" | "outline" | "inline";
}> = ({ text, submittedText, isSubmittingText, color, mode, ...rest }) => {
  const defaultText = "Submit";
  const defaultSubmittedText = "Submitted";
  const defaultIsSubmittingText = "Submitting";

  const { isDirty, isSubmitting, isSubmitted, isValid } = useFormState();
  let currentText = text ?? defaultText;
  if (isSubmitting) {
    currentText = isSubmittingText ?? defaultIsSubmittingText;
  } else if (!isDirty && isSubmitted && isValid) {
    currentText = submittedText ?? defaultSubmittedText;
  }

  return (
    <Button
      color={color || "primary"}
      mode={mode || "solid"}
      type="submit"
      disabled={isSubmitting}
      {...rest}
    >
      {currentText}
    </Button>
  );
};

export default Submit;
