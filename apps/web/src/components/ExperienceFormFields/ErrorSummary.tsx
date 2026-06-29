import { useRef, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import {
  ErrorSummary as ErrorSummaryAlert,
  flattenErrors,
} from "@gc-digital-talent/forms";

import { getExperienceFormLabels } from "~/utils/experienceUtils";
import type {
  AllExperienceFormValues,
  ExperienceType,
} from "~/types/experience";

interface ErrorSummaryProps {
  experienceType?: ExperienceType | "";
}

const ErrorSummary = ({ experienceType }: ErrorSummaryProps) => {
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
  const isSubmitted = submitCount > 0;
  const hasErrors = !!flatErrors;
  const shouldShow = isSubmitted && hasErrors;

  useEffect(() => {
    // After during submit, if there are errors, focus the summary
    if (submitCount > 0 && flatErrors) {
      errorSummaryRef.current?.focus();
    }
  }, [flatErrors, submitCount]);

  useEffect(() => {
    if (shouldShow && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
  }, [shouldShow, submitCount]);

  return (
    <ErrorSummaryAlert
      ref={errorSummaryRef}
      labels={labels}
      show={shouldShow}
    />
  );
};

export default ErrorSummary;
