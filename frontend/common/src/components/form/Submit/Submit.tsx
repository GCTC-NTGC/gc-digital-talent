import React from "react";
import { useFormState } from "react-hook-form";
import { useIntl } from "react-intl";
import { Button } from "../..";

export interface SubmitProps {
  text?: string | React.ReactNode;
  submittedText?: string | React.ReactNode;
  isSubmittingText?: string | React.ReactNode;
  color?: "primary" | "secondary" | "cta" | "white";
  mode?: "solid" | "outline" | "inline";
  isSubmitting?: boolean;
}

const Submit: React.FunctionComponent<SubmitProps> = ({
  text,
  submittedText,
  isSubmittingText,
  color,
  mode,
  isSubmitting: overrideSubmitting,
  ...rest
}) => {
  const intl = useIntl();
  const defaultText = intl.formatMessage({
    defaultMessage: "Submit",
    description: "Default text for submit button.",
  });
  const defaultSubmittedText = intl.formatMessage({
    defaultMessage: "Submitted",
    description: "Default text for submitted button.",
  });
  const defaultIsSubmittingText = intl.formatMessage({
    defaultMessage: "Submitting",
    description: "Default text for submitting button.",
  });

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
      disabled={isSubmitting || overrideSubmitting}
      {...rest}
    >
      {currentText}
    </Button>
  );
};

export default Submit;
