import React from "react";
import { useFormState } from "react-hook-form";
import { useIntl } from "react-intl";
import { ButtonProps, Color } from "../../Button";
import { Button } from "../..";

export interface SubmitProps extends Omit<ButtonProps, "ref" | "type"> {
  text?: string | React.ReactNode;
  submittedText?: string | React.ReactNode;
  isSubmittingText?: string | React.ReactNode;
  color?: Color;
  mode?: "solid" | "outline" | "inline";
  isSubmitting?: boolean;
  disabled?: boolean;
}

const Submit: React.FunctionComponent<SubmitProps> = ({
  text,
  submittedText,
  isSubmittingText,
  color,
  mode,
  isSubmitting: overrideSubmitting,
  disabled,
  ...rest
}) => {
  const intl = useIntl();
  const defaultText = intl.formatMessage({
    defaultMessage: "Submit",
    id: "YHqVoj",
    description: "Default text for submit button.",
  });
  const defaultSubmittedText = intl.formatMessage({
    defaultMessage: "Submitted",
    id: "rGTGvl",
    description: "Default text for submitted button.",
  });
  const defaultIsSubmittingText = intl.formatMessage({
    defaultMessage: "Submitting",
    id: "mDOWWQ",
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
      disabled={disabled || isSubmitting || overrideSubmitting}
      {...rest}
    >
      {currentText}
    </Button>
  );
};

export default Submit;
