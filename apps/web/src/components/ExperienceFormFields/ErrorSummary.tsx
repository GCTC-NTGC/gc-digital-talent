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
  const shouldShow = submitCount > 0 && flattenErrors(errors).length > 0;

  // Focus the summary once per submit attempt
  // In line with error rendering in `packages/forms/src/components/ErrorSummary.tsx`
  useEffect(() => {
    errorSummaryRef.current?.focus();
  }, [submitCount]);

  return (
    <ErrorSummaryAlert
      ref={errorSummaryRef}
      labels={labels}
      show={shouldShow}
    />
  );
};

export default ErrorSummary;
