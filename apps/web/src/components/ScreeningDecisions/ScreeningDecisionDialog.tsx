import { useState } from "react";
import { useIntl } from "react-intl";

import {
  AssessmentStepType,
  FragmentType,
  getFragment,
  graphql,
  Maybe,
  Scalars,
  User,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Button, Dialog } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import { BasicForm, Submit } from "@gc-digital-talent/forms";

import { FormValues } from "./types";
import {
  convertApiToFormValues,
  DIALOG_TYPE,
  getDialogType,
  hasAttachedExperiences,
} from "./utils";
import { Trigger } from "./Trigger";
import Header from "./Header";
import AssessmentType from "./AssessmentType";
import ScreeningQuestions from "./ScreeningQuestions";
import SupportingEvidence from "./SupportingEvidence";
import useSaveHandler from "./useSaveHandler";
import useLabels from "./useLabels";
import ScreeningDecisionDialogForm from "./ScreeningDecisionDialogForm";

export const ScreeningDecisionDialog_Fragment = graphql(/** GraphQL */ `
  fragment ScreeningDecisionDialog on PoolCandidate {
    id
    pool {
      classification {
        group
      }
      publishingGroup {
        value
      }
      assessmentSteps {
        id
        ...ScreeningDialogHeaderStep
        type {
          value
        }
        poolSkills {
          id
          skill {
            id
          }
          ...ScreeningTriggerPoolSkill
          ...ScreeningDialogHeaderPoolSkill
          ...ScreeningDialogAssessmentTypePoolSkill
        }
      }
    }

    ...ScreeningDialogAssessmentType
    ...ScreeningDialogScreeningQuestions
    ...ScreeningDialogSupportingEvidence

    profileSnapshot

    assessmentResults {
      id
      ...ScreeningTriggerResult
      ...ScreeningDialogFormValues

      poolSkill {
        id
      }
      assessmentStep {
        id
      }
    }
  }
`);

export interface ScreeningDecisionDialogProps {
  query: FragmentType<typeof ScreeningDecisionDialog_Fragment>;
  stepId: Scalars["UUID"]["output"];
  poolSkillId?: Scalars["UUID"]["output"];
  defaultOpen?: boolean;
}

const ScreeningDecisionDialog = ({
  query,
  stepId,
  poolSkillId,
  defaultOpen = false,
}: ScreeningDecisionDialogProps) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState<boolean>(defaultOpen);
  const labels = useLabels();
  const candidate = getFragment(ScreeningDecisionDialog_Fragment, query);
  const snapshot = JSON.parse(
    String(candidate?.profileSnapshot),
  ) as Maybe<User>;
  const step = unpackMaybes(candidate?.pool.assessmentSteps).find(
    ({ id }) => id === stepId,
  );
  const poolSkill = unpackMaybes(step?.poolSkills).find(
    ({ id }) => id === poolSkillId,
  );
  const result = unpackMaybes(candidate?.assessmentResults)?.find(
    (assessmentResult) =>
      assessmentResult.assessmentStep?.id === stepId &&
      assessmentResult.poolSkill?.id === poolSkillId,
  );
  const dialogType = getDialogType(step?.type?.value, poolSkillId);
  const { saving, onSave } = useSaveHandler({
    isEducation: dialogType === DIALOG_TYPE.Education,
    stepId,
    poolSkillId,
    resultId: result?.id,
    candidateId: candidate.id,
  });

  if (
    dialogType === DIALOG_TYPE.Education &&
    step?.type?.value !== AssessmentStepType.ApplicationScreening
  ) {
    return null;
  }

  const experienceAttached = hasAttachedExperiences(
    snapshot?.experiences,
    poolSkill?.skill,
  );

  const handleSave = async (data: FormValues) => {
    if (saving) return; // Prevent multiple submissions
    await onSave(data)
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Assessment successfully saved.",
            id: "+jknvj",
            description:
              "Message displayed to user if the assessment result was saved successfully.",
          }),
        );
        setOpen(false);
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Failed to save the assessment",
            id: "xcsYTa",
            description:
              "Message displayed to user if assessment result fails to get created/updated.",
          }),
        );
      });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Trigger
        resultQuery={result}
        poolSkillquery={poolSkill}
        {...{ dialogType, experienceAttached }}
      />
      <Dialog.Content hasSubtitle>
        <Header
          candidateName={
            snapshot?.firstName ??
            intl.formatMessage(commonMessages.notAvailable)
          }
          stepQuery={step}
          poolSkillQuery={poolSkill}
          dialogType={dialogType}
        />
        <Dialog.Body>
          <AssessmentType
            candidateQuery={candidate}
            poolSkillQuery={poolSkill}
            dialogType={dialogType}
          />
          {dialogType === DIALOG_TYPE.ScreeningQuestions ? (
            <ScreeningQuestions query={candidate} />
          ) : (
            <SupportingEvidence
              query={candidate}
              experiences={unpackMaybes(snapshot?.experiences)}
              skillId={poolSkill?.skill?.id}
              dialogType={dialogType}
            />
          )}
          <BasicForm
            onSubmit={handleSave}
            labels={labels}
            options={{
              defaultValues: convertApiToFormValues(result),
            }}
          >
            <ScreeningDecisionDialogForm dialogType={dialogType} />
            <Dialog.Footer>
              <Submit
                color="primary"
                text={intl.formatMessage({
                  defaultMessage: "Save decision",
                  id: "hQ2+aE",
                  description:
                    "Save button label for screening decision dialogs",
                })}
                isSubmittingText={intl.formatMessage(commonMessages.saving)}
              />
              <Dialog.Close>
                <Button type="button" mode="inline" color="warning">
                  {intl.formatMessage(commonMessages.cancel)}
                </Button>
              </Dialog.Close>
            </Dialog.Footer>
          </BasicForm>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ScreeningDecisionDialog;
