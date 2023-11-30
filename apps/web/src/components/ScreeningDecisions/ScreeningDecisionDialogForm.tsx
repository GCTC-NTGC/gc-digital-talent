import * as React from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import {
  AssessmentDecision,
  AssessmentResult,
  AssessmentResultJustification,
} from "@gc-digital-talent/graphql";
import { CardOptionGroup, Checklist, TextArea } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";

import useLabels from "./useLabels";
import { DialogType } from "./useDialogType";
import useOptions from "./useOptions";

const TEXT_AREA_ROWS = 3;
const TEXT_AREA_MAX_WORDS = 200;

type FormValues = {
  assessmentDecision: AssessmentResult["assessmentDecision"];
  justifications: AssessmentResult["justifications"];
  assessmentDecisionLevel: AssessmentResult["assessmentDecisionLevel"];
  otherJustificationNotes: AssessmentResult["otherJustificationNotes"];
};

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

  const { watch } = methods;
  const watchAssessmentDecision = watch("assessmentDecision");
  const watchJustifications = watch("justifications");

  const { assessmentDecisionItems, successfulOptions, unsuccessfulOptions } =
    options;

  const otherReasonSelected = watchJustifications?.includes(
    AssessmentResultJustification.FailedOther,
  );

  return (
    <>
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
              />
            </div>
          ) : (
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
              <TextArea
                id="otherJustificationNotes"
                name="otherJustificationNotes"
                rows={TEXT_AREA_ROWS}
                wordLimit={TEXT_AREA_MAX_WORDS}
                label={labels.decisionNotes}
              />
            </div>
          )}
        </div>
      )}
      {watchAssessmentDecision === AssessmentDecision.Unsuccessful && (
        <>
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
          {otherReasonSelected && (
            <div data-h2-margin-bottom="base(x1)">
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
      )}
    </>
  );
};

export default ScreeningDecisionDialogForm;
