import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useIntl } from "react-intl";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import PauseCircleIcon from "@heroicons/react/20/solid/PauseCircleIcon";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";

import { AssessmentDecision } from "@gc-digital-talent/graphql";
import Input from "@gc-digital-talent/forms/Input";
import Field from "@gc-digital-talent/forms/Field";
import SwitchInput from "@gc-digital-talent/forms/SwitchInput";

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
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column) p-tablet(row)"
          data-h2-align-items="base(flex-start) p-tablet(flex-end)"
          data-h2-gap="base(x.5)"
          data-h2-width="base(100%)"
        >
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
            <Field.BoundingBox
              data-h2-border-color="base(gray) base:focus-visible(focus)"
              data-h2-flex-direction="base(row)"
              data-h2-gap="base(x.25)"
              // To match input off by 0.01px
              data-h2-padding="base(x.4)"
            >
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
