import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useIntl } from "react-intl";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import PauseCircleIcon from "@heroicons/react/20/solid/PauseCircleIcon";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";

import { AssessmentDecision } from "@gc-digital-talent/graphql";
import { Field, Input, SwitchInput } from "@gc-digital-talent/forms";

import { NO_DECISION } from "~/utils/assessmentResults";
import poolCandidateMessages from "~/messages/poolCandidateMessages";

import { ResultFilters, defaultFilters } from "./utils";

interface FiltersProps {
  defaultValues?: ResultFilters;
  onFiltersChange: (newFilters: ResultFilters) => void;
}

const Filters = ({
  onFiltersChange,
  defaultValues = defaultFilters,
}: FiltersProps) => {
  const intl = useIntl();
  const methods = useForm<ResultFilters>({
    defaultValues: {
      ...defaultFilters,
      ...defaultValues,
    },
    mode: "onChange",
  });
  const { watch, handleSubmit } = methods;

  useEffect(() => {
    const subscription = watch((newValues) => {
      onFiltersChange({
        ...defaultFilters,
        ...newValues,
      });
    });

    return () => subscription.unsubscribe();
  }, [watch, handleSubmit, onFiltersChange]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onFiltersChange)}>
        <div className="flex w-full flex-col items-start gap-3 xs:flex-row xs:items-end">
          <Input
            name="query"
            id="query"
            type="text"
            label={intl.formatMessage({
              defaultMessage: "Filter candidates by name",
              id: "ZAcxSx",
              description: "Label for candidate search input",
            })}
          />
          <Field.Fieldset>
            <Field.Legend>
              {intl.formatMessage({
                defaultMessage: "Filter candidates by status",
                id: "QsILUL",
                description:
                  "Legend for filtering candidates by assessment decisions",
              })}
            </Field.Legend>
            <Field.BoundingBox className="flex-row gap-1.5 p-2 focus-visible:border-focus">
              <SwitchInput
                name={NO_DECISION}
                id={NO_DECISION}
                label={intl.formatMessage(poolCandidateMessages.toAssess)}
                color="warning"
                hideLabel
                icon={{
                  default: ExclamationCircleIcon,
                }}
              />
              <SwitchInput
                name={AssessmentDecision.Successful}
                id={AssessmentDecision.Successful}
                label={intl.formatMessage(poolCandidateMessages.successful)}
                color="success"
                hideLabel
                icon={{
                  default: CheckCircleIcon,
                }}
              />
              <SwitchInput
                name={AssessmentDecision.Hold}
                id={AssessmentDecision.Hold}
                label={intl.formatMessage(poolCandidateMessages.onHold)}
                color="secondary"
                hideLabel
                icon={{
                  default: PauseCircleIcon,
                }}
              />
              <SwitchInput
                name={AssessmentDecision.Unsuccessful}
                id={AssessmentDecision.Unsuccessful}
                label={intl.formatMessage(poolCandidateMessages.unsuccessful)}
                color="error"
                hideLabel
                icon={{
                  default: XCircleIcon,
                }}
              />
            </Field.BoundingBox>
          </Field.Fieldset>
        </div>
      </form>
    </FormProvider>
  );
};

export default Filters;
