import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";

import {
  AssessmentDecision,
  AssessmentResultJustification,
} from "@gc-digital-talent/graphql";
import { CardOptionGroup, Checklist, TextArea } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { Loading, Well } from "@gc-digital-talent/ui";

import { NO_DECISION } from "~/utils/assessmentResults";

import useLabels from "./useLabels";
import { DialogType } from "./useDialogType";
import useOptions from "./useOptions";
import { FormValues, educationJustificationContext } from "./utils";

const TEXT_AREA_ROWS = 3;
const TEXT_AREA_MAX_WORDS = 200;

interface ContextBlockProps {
  messages: string[];
  key: string;
}

const ContextBlock = ({ messages, key }: ContextBlockProps) => (
  <div className="mb-3">
    {messages.map((message, index) => (
      <span
        key={`${key}-${index + 1}`}
        className="mb-3 flex justify-start gap-3"
      >
        <CheckIcon className="size-6" />
        <p>{message}</p>
      </span>
    ))}
  </div>
);

type FormNames =
  | "assessmentDecision"
  | "justifications"
  | "assessmentDecisionLevel"
  | "skillDecisionNotes"
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

  const {
    assessmentDecisionItems,
    successfulOptions,
    unsuccessfulOptions,
    fetching,
  } = options;

  const isAssessmentDecisionSuccessful =
    watchAssessmentDecision === AssessmentDecision.Successful;
  const isAssessmentDecisionUnSuccessful =
    watchAssessmentDecision === AssessmentDecision.Unsuccessful;
  const isAssessmentOnHold =
    watchAssessmentDecision === AssessmentDecision.Hold;
  const isAssessmentDecisionNotSure = watchAssessmentDecision === NO_DECISION;
  const educationRequirementSelected =
    (!Array.isArray(watchJustifications) &&
      watchJustifications ===
        AssessmentResultJustification.EducationAcceptedInformation) ||
    watchJustifications ===
      AssessmentResultJustification.EducationAcceptedCombinationEducationWorkExperience ||
    watchJustifications ===
      AssessmentResultJustification.EducationAcceptedWorkExperienceEquivalency;
  const decisionNotesRequired = watchJustifications?.includes(
    AssessmentResultJustification.FailedOther,
  );

  /**
   * Reset un-rendered fields
   */
  useEffect(() => {
    const resetDirtyField = (name: FormNames) => {
      resetField(name, { keepDirty: false, defaultValue: null });
    };

    // Reset all optional fields
    if (isAssessmentDecisionNotSure) {
      resetDirtyField("justifications");
      resetDirtyField("assessmentDecisionLevel");
    }

    if (isAssessmentDecisionSuccessful) {
      if (!educationRequirementSelected) {
        resetDirtyField("justifications");
      }
    }

    if (isAssessmentDecisionUnSuccessful) {
      resetDirtyField("assessmentDecisionLevel");
    }

    if (isAssessmentOnHold) {
      resetDirtyField("assessmentDecisionLevel");
      setValue("justifications", []);
    }
  }, [
    educationRequirementSelected,
    isAssessmentDecisionSuccessful,
    isAssessmentDecisionUnSuccessful,
    isAssessmentDecisionNotSure,
    isAssessmentOnHold,
    resetField,
    setValue,
  ]);

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

  return fetching ? (
    <Loading inline />
  ) : (
    <>
      <div className="mb-6">
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
            <>
              <div className="mb-6">
                <CardOptionGroup
                  idPrefix="justifications"
                  name="justifications"
                  legend={labels.justification}
                  items={successfulOptions}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  context={
                    educationContext ? (
                      <ContextBlock
                        messages={educationContext.messages}
                        key={educationContext.key}
                      />
                    ) : null
                  }
                />
              </div>
              <div className="mb-6">
                <TextArea
                  id="skillDecisionNotes"
                  name="skillDecisionNotes"
                  rows={TEXT_AREA_ROWS}
                  wordLimit={TEXT_AREA_MAX_WORDS}
                  label={labels.decisionNotes}
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
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
              <div className="mb-6">
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
        <div className="mb-6">
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
      {isAssessmentOnHold || isAssessmentDecisionUnSuccessful ? (
        <div className="my-6">
          <TextArea
            id="skillDecisionNotes"
            name="skillDecisionNotes"
            rows={TEXT_AREA_ROWS}
            wordLimit={TEXT_AREA_MAX_WORDS}
            label={labels.decisionNotes}
            rules={
              isAssessmentOnHold || decisionNotesRequired
                ? { required: intl.formatMessage(errorMessages.required) }
                : { required: undefined }
            }
          />
        </div>
      ) : null}
    </>
  );
};

export default ScreeningDecisionDialogForm;
