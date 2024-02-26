import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import { ErrorSummary as ErrorSummaryAlert } from "@gc-digital-talent/forms";
import { flattenErrors } from "@gc-digital-talent/forms/src/utils";

import { getExperienceFormLabels } from "~/utils/experienceUtils";
import { ExperienceType } from "~/types/experience";

interface ErrorSummaryProps {
  experienceType?: ExperienceType | "";
}

const ErrorSummary = ({ experienceType }: ErrorSummaryProps) => {
  const [showErrorSummary, setShowErrorSummary] =
    React.useState<boolean>(false);
  const errorSummaryRef = React.useRef<HTMLDivElement>(null);
  const intl = useIntl();
  const type = useWatch({ name: "experienceType" });
  const derivedType = type ?? experienceType;
  const labels = getExperienceFormLabels(intl, derivedType);
  const {
    formState: { errors, isSubmitting },
  } = useFormContext();
  const flatErrors = flattenErrors(errors);

  React.useEffect(() => {
    // After during submit, if there are errors, focus the summary
    if (errors && isSubmitting) {
      setShowErrorSummary(true);
    }
  }, [isSubmitting, errors]);

  React.useEffect(() => {
    if (
      showErrorSummary &&
      errorSummaryRef.current &&
      isSubmitting &&
      flatErrors.length > 0
    ) {
      errorSummaryRef.current.focus();
    }
  }, [showErrorSummary, flatErrors, isSubmitting]);

  return (
    <ErrorSummaryAlert
      ref={errorSummaryRef}
      labels={labels}
      show={errors && showErrorSummary}
    />
  );
};

export default ErrorSummary;
