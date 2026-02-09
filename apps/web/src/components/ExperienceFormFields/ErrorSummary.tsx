import { useState, useRef, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import {
  ErrorSummary as ErrorSummaryAlert,
  flattenErrors,
} from "@gc-digital-talent/forms";

import { getExperienceFormLabels } from "~/utils/experienceUtils";
import { AllExperienceFormValues, ExperienceType } from "~/types/experience";

interface ErrorSummaryProps {
  experienceType?: ExperienceType | "";
}

const ErrorSummary = ({ experienceType }: ErrorSummaryProps) => {
  const [showErrorSummary, setShowErrorSummary] = useState<boolean>(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const intl = useIntl();
  const type = useWatch<AllExperienceFormValues>({
    name: "experienceType",
  }) as ExperienceType;
  const derivedType: ExperienceType = type ?? experienceType ?? "personal";
  const labels = getExperienceFormLabels(intl, derivedType);
  const {
    formState: { errors, submitCount },
  } = useFormContext();
  const flatErrors = flattenErrors(errors);

  useEffect(() => {
    // After during submit, if there are errors, focus the summary
    if (submitCount > 0 && flatErrors) {
      setShowErrorSummary(true);
      errorSummaryRef.current?.focus();
    }
  }, [submitCount]);

  useEffect(() => {
    if (showErrorSummary && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
  }, [showErrorSummary, submitCount]);

  return (
    <ErrorSummaryAlert
      ref={errorSummaryRef}
      labels={labels}
      show={errors && showErrorSummary}
    />
  );
};

export default ErrorSummary;
