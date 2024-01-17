import * as React from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";

import {
  AssessmentDecision,
  AssessmentResultJustification,
} from "@gc-digital-talent/graphql";
import { CardOptionGroup, Checklist, TextArea } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { Well } from "@gc-digital-talent/ui";

import { NO_DECISION } from "~/utils/assessmentResults";

import useLabels from "./useLabels";
import { DialogType } from "./useDialogType";
import useOptions from "./useOptions";
import { FormValues, educationJustificationContext } from "./utils";

const TEXT_AREA_ROWS = 3;
const TEXT_AREA_MAX_WORDS = 200;

type FormNames =
  | "assessmentDecision"
  | "justifications"
  | "assessmentDecisionLevel"
  | "otherJustificationNotes"
  | "skillDecisionNotes"
  | "assessmentNotes"
  | `justifications.${number}`;

interface ScreeningDecisionDialogFormProps {
  dialogType: DialogType;
}

const ScreeningDecisionDialogForm = ({
  dialogType,
}: ScreeningDecisionDialogFormProps) => {
  const intl = useIntl();
  const options = useOptions(dialogType);
  const labels = useLabels();
  const methods = useFormContext<FormValues>();

  const { watch, resetField, setValue } = methods;
  const watchAssessmentDecision = watch("assessmentDecision");
  const watchJustifications = watch("justifications");

  const { assessmentDecisionItems, successfulOptions, unsuccessfulOptions } =
    options;

  const otherReasonSelected =
    Array.isArray(watchJustifications) &&
    watchJustifications.includes(AssessmentResultJustification.FailedOther);
  const isAssessmentDecisionSuccessful =
    watchAssessmentDecision === AssessmentDecision.Successful;
  const isAssessmentDecisionUnSuccessful =
    watchAssessmentDecision === AssessmentDecision.Unsuccessful;
  const isAssessmentOnHold =
    watchAssessmentDecision === AssessmentDecision.Hold;
  const isAssessmentDecisionNotSure = watchAssessmentDecision === NO_DECISION;

  /**
   * Reset un-rendered fields
   */
  React.useEffect(() => {
    const resetDirtyField = (name: FormNames) => {
      resetField(name, { keepDirty: false, defaultValue: null });
    };

    // Reset all optional fields
    if (isAssessmentDecisionNotSure) {
      resetDirtyField("justifications");
      resetDirtyField("assessmentDecisionLevel");
      resetDirtyField("skillDecisionNotes");
      if (!otherReasonSelected) {
        resetDirtyField("otherJustificationNotes");
      }
    }

    if (isAssessmentDecisionUnSuccessful) {
      resetDirtyField("assessmentDecisionLevel");
      resetDirtyField("skillDecisionNotes");
      if (!otherReasonSelected) {
        resetDirtyField("otherJustificationNotes");
      }
    }

    if (isAssessmentDecisionSuccessful) {
      resetDirtyField("justifications");
      if (!otherReasonSelected) {
        resetDirtyField("otherJustificationNotes");
      }
    }

    if (isAssessmentOnHold) {
      resetDirtyField("assessmentDecisionLevel");
      resetDirtyField("skillDecisionNotes");
      setValue("justifications", [AssessmentResultJustification.FailedOther]);
    }
  }, [
    resetField,
    isAssessmentDecisionSuccessful,
    isAssessmentDecisionUnSuccessful,
    isAssessmentDecisionNotSure,
    otherReasonSelected,
    isAssessmentOnHold,
    setValue,
  ]);

  const contextBlock = (messages: string[], key: string) => (
    <div data-h2-margin="base(x.5)">
      {messages.map((message, index) => (
        <span
          key={`${key}-${index + 1}`}
          data-h2-margin-bottom="base(x.5)"
          data-h2-display="base(flex)"
          data-h2-justify-content="base(flex-start)"
          data-h2-gap="base(x.5)"
        >
          <CheckIcon data-h2-height="base(x1)" data-h2-width="base(x1)" />
          <p>{message}</p>
        </span>
      ))}
    </div>
  );

  const educationContext = educationJustificationContext(
    Array.isArray(watchJustifications)
      ? watchJustifications?.find(
          (justification) =>
            justification ===
              AssessmentResultJustification.EducationAcceptedInformation ||
            justification ===
              AssessmentResultJustification.EducationAcceptedCombinationEducationWorkExperience ||
            justification ===
              AssessmentResultJustification.EducationAcceptedWorkExperienceEquivalency,
        )
      : watchJustifications,
    intl,
  );

  return (
    <>
      {dialogType === "GENERIC" && (
        <div data-h2-margin-bottom="base(x1)">
          <TextArea
            id="assessmentNotes"
            name="assessmentNotes"
            rows={TEXT_AREA_ROWS}
            wordLimit={TEXT_AREA_MAX_WORDS}
            label={labels.assessmentNotes}
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
        </div>
      )}
      <div data-h2-margin-bottom="base(x1)">
        <CardOptionGroup
          idPrefix="assessmentDecision"
          name="assessmentDecision"
          legend={labels.assessmentDecision}
          items={assessmentDecisionItems}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      </div>
      {watchAssessmentDecision === AssessmentDecision.Successful && (
        <div>
          {dialogType === "EDUCATION" ? (
            <div data-h2-margin-bottom="base(x1)">
              <CardOptionGroup
                idPrefix="justifications"
                name="justifications"
                legend={labels.justification}
                items={successfulOptions}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                context={
                  educationContext
                    ? contextBlock(
                        educationContext.messages,
                        educationContext.key,
                      )
                    : null
                }
              />
            </div>
          ) : (
            <>
              <div data-h2-margin-bottom="base(x1)">
                <CardOptionGroup
                  idPrefix="assessmentDecisionLevel"
                  name="assessmentDecisionLevel"
                  legend={labels.assessmentDecisionLevel}
                  items={successfulOptions}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
              </div>
              <div data-h2-margin-bottom="base(x1)">
                <TextArea
                  id="skillDecisionNotes"
                  name="skillDecisionNotes"
                  rows={TEXT_AREA_ROWS}
                  wordLimit={TEXT_AREA_MAX_WORDS}
                  label={labels.decisionNotes}
                />
              </div>
            </>
          )}
        </div>
      )}
      {watchAssessmentDecision === AssessmentDecision.Unsuccessful && (
        <div data-h2-margin-bottom="base(x1)">
          <Checklist
            idPrefix="justifications"
            name="justifications"
            legend={labels.justification}
            items={unsuccessfulOptions}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        </div>
      )}
      {watchAssessmentDecision === AssessmentDecision.Hold && (
        <Well fontSize="caption">
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Not sufficiently demonstrated in this assessment method - move to further testing. (Applicable only in instances where assessment scores are cumulative across assessment methods. Not applicable in cases where applicants must pass each essential criteria at each stage).",
              id: "DOmsNQ",
              description:
                "Note for when an assessment was unsuccessful but put on hold",
            })}
          </p>
        </Well>
      )}
      {otherReasonSelected && (
        <div data-h2-margin="base(x1, 0)">
          <TextArea
            id="otherJustificationNotes"
            name="otherJustificationNotes"
            rows={TEXT_AREA_ROWS}
            wordLimit={TEXT_AREA_MAX_WORDS}
            label={labels.other}
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
        </div>
      )}
    </>
  );
};

export default ScreeningDecisionDialogForm;
