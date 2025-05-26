import { useFormState } from "react-hook-form";
import { useIntl } from "react-intl";
import { ReactNode } from "react";

import { ButtonProps, Color, Button } from "@gc-digital-talent/ui";
import { formMessages } from "@gc-digital-talent/i18n";

export interface SubmitProps extends Omit<ButtonProps, "ref" | "type"> {
  text?: string | ReactNode;
  submittedText?: string | ReactNode;
  isSubmittingText?: string | ReactNode;
  color?: Color;
  mode?: "solid" | "inline";
  isSubmitting?: boolean;
  disabled?: boolean;
}

const Submit = ({
  text,
  submittedText,
  isSubmittingText,
  color,
  mode,
  icon,
  isSubmitting: overrideSubmitting,
  disabled,
  ...rest
}: SubmitProps) => {
  const intl = useIntl();
  const defaultText = intl.formatMessage(formMessages.submit);
  const defaultSubmittedText = intl.formatMessage(formMessages.submitted);
  const defaultIsSubmittingText = intl.formatMessage(formMessages.submitting);

  const { isDirty, isSubmitting, isSubmitted, isValid } = useFormState();
  let currentText = text ?? defaultText;
  if (isSubmitting || overrideSubmitting) {
    currentText = isSubmittingText ?? defaultIsSubmittingText;
  } else if (!isDirty && isSubmitted && isValid) {
    currentText = submittedText ?? defaultSubmittedText;
  }

  return (
    <Button
      color={color ?? "secondary"}
      mode={mode ?? "solid"}
      type="submit"
      icon={icon}
      disabled={disabled || isSubmitting || overrideSubmitting}
      {...rest}
    >
      {currentText}
    </Button>
  );
};

export default Submit;
