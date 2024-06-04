import { IntlShape, useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import { useMutation } from "urql";
import isEmpty from "lodash/isEmpty";
import { ReactNode, useState } from "react";

import {
  AssessmentDecision,
  AssessmentResult,
  AssessmentResultJustification,
  AssessmentResultType,
  AssessmentStep,
  CreateAssessmentResultInput,
  Experience,
  Maybe,
  PoolCandidate,
  PoolSkill,
  PoolSkillType,
  Skill,
  UpdateAssessmentResultInput,
  User,
  graphql,
} from "@gc-digital-talent/graphql";
import {
  Accordion,
  Button,
  Color,
  Dialog,
  HeadingLevel,
  Well,
  incrementHeadingRank,
} from "@gc-digital-talent/ui";
import { BasicForm, Submit } from "@gc-digital-talent/forms";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  getAssessmentStepType,
  getLocale,
  getLocalizedName,
  getSkillLevelDefinition,
  getSkillLevelName,
  getAssessmentDecisionLevel,
  getTableAssessmentDecision,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

import { getExperienceSkills } from "~/utils/skillUtils";
import { getEducationRequirementOptions } from "~/pages/Applications/ApplicationEducationPage/utils";
import { isIAPPool } from "~/utils/poolUtils";
import poolCandidateMessages from "~/messages/poolCandidateMessages";

import useLabels from "./useLabels";
import ExperienceCard from "../ExperienceCard/ExperienceCard";
import useDialogType, { DialogType } from "./useDialogType";
import ScreeningDecisionDialogForm from "./ScreeningDecisionDialogForm";
import useHeaders from "./useHeaders";
import {
  convertFormValuesToApiCreateInput,
  convertFormValuesToApiUpdateInput,
  FormValues,
} from "./utils";

const getSkillLevelMessage = (
  poolSkill: PoolSkill | undefined,
  intl: IntlShape,
): string => {
  let skillLevel = "";
  if (poolSkill?.requiredLevel && poolSkill.skill) {
    skillLevel = intl.formatMessage(
      getSkillLevelName(poolSkill.requiredLevel, poolSkill.skill.category),
    );
  }
  return skillLevel;
};

const getTitle = (poolSkill: PoolSkill | undefined, intl: IntlShape) => {
  let title = "";
  const skillLevel = getSkillLevelMessage(poolSkill, intl);
  if (!isEmpty(skillLevel)) {
    title = intl.formatMessage(
      {
        defaultMessage: `See definitions for "{skillName}" and "{skillLevel}"`,
        id: "o5zW6Y",
        description:
          "Accordion title for skill and skill level header on screening decision dialog.",
      },
      {
        skillName: getLocalizedName(poolSkill?.skill?.name, intl),
        skillLevel,
      },
    );
  } else {
    title = intl.formatMessage(
      {
        defaultMessage: `See definitions for "{skillName}"`,
        id: "ZZpC8s",
        description:
          "Accordion title for skill header on screening decision dialog.",
      },
      {
        skillName: getLocalizedName(poolSkill?.skill?.name, intl),
      },
    );
  }
  return title;
};

const AssessmentStepTypeSection = ({
  educationRequirementOption,
  poolSkill,
  type,
}: {
  educationRequirementOption: ReactNode;
  poolSkill?: PoolSkill;
  type: DialogType;
}) => {
  const intl = useIntl();
  const skillLevel = getSkillLevelMessage(poolSkill, intl);

  switch (type) {
    case "EDUCATION":
      return (
        <div>
          <p data-h2-margin-bottom="base(x.5)">
            {intl.formatMessage({
              defaultMessage: "Selected requirement option:",
              id: "FS4Dg5",
              description:
                "Header for selected requirement option in education requirement screening decision dialog.",
            })}
          </p>
          {educationRequirementOption ? (
            <Well
              data-h2-margin-bottom="base(x1)"
              data-h2-text-align="base(left)"
            >
              {educationRequirementOption}
            </Well>
          ) : (
            <p
              data-h2-margin-bottom="base(x.5)"
              data-h2-margin-left="base(x.25)"
            >
              {intl.formatMessage(commonMessages.notFound)}
            </p>
          )}
        </div>
      );
    default:
      return (
        <div>
          <Well
            data-h2-margin-bottom="base(x1)"
            data-h2-text-align="base(center)"
          >
            <Accordion.Root type="single" collapsible>
              <Accordion.Item value="skill">
                <Accordion.Trigger>
                  {getTitle(poolSkill, intl)}
                </Accordion.Trigger>
                <Accordion.Content data-h2-text-align="base(left)">
                  <div data-h2-margin="base(x1, 0)">
                    <p
                      data-h2-margin-bottom="base(x1)"
                      data-h2-font-weight="base(bold)"
                    >
                      {getLocalizedName(poolSkill?.skill?.name, intl)}
                    </p>
                    <p>
                      {getLocalizedName(poolSkill?.skill?.description, intl)}
                    </p>
                  </div>
                  <div>
                    {poolSkill?.requiredLevel && poolSkill.skill ? (
                      <>
                        <p
                          data-h2-margin-bottom="base(x1)"
                          data-h2-font-weight="base(bold)"
                        >
                          {skillLevel}
                        </p>
                        <p>
                          {intl.formatMessage(
                            getSkillLevelDefinition(
                              poolSkill.requiredLevel,
                              poolSkill.skill.category,
                            ),
                          )}
                        </p>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </Well>
        </div>
      );
  }
};

const ScreeningQuestions = ({
  poolCandidate,
}: {
  poolCandidate: PoolCandidate | undefined;
}) => {
  const intl = useIntl();
  const screeningQuestionResponses =
    poolCandidate?.screeningQuestionResponses?.filter(notEmpty) || [];
  const screeningQuestions = screeningQuestionResponses
    .map((response) => response.screeningQuestion)
    .filter(notEmpty);

  if (screeningQuestions.length === 0)
    return (
      <p data-h2-margin-bottom="base(x1)">
        {intl.formatMessage(commonMessages.notProvided)}
      </p>
    );
  return (
    <Accordion.Root type="multiple" data-h2-margin-bottom="base(x1)">
      {screeningQuestions.length &&
        screeningQuestions.map((screeningQuestion) => (
          <Accordion.Item
            value={screeningQuestion.id}
            key={screeningQuestion.id}
          >
            <Accordion.Trigger>
              {getLocalizedName(screeningQuestion.question, intl)}
            </Accordion.Trigger>
            <Accordion.Content>
              {screeningQuestionResponses.find(
                (response) =>
                  response.screeningQuestion?.id === screeningQuestion.id,
              )?.answer || intl.formatMessage(commonMessages.notFound)}
            </Accordion.Content>
          </Accordion.Item>
        ))}
    </Accordion.Root>
  );
};

const SupportingEvidence = ({
  experiences,
  skill,
  headingAs = "h4",
}: {
  experiences: Experience[];
  skill?: Skill;
  headingAs?: HeadingLevel;
}) => {
  const intl = useIntl();
  const contentHeadingLevel = incrementHeadingRank(headingAs);
  return (
    <>
      <p data-h2-margin-bottom="base(x.5)">
        {intl.formatMessage({
          defaultMessage: "Supporting evidence:",
          id: "w59dPh",
          description:
            "Header for supporting evidence section in screening decision dialog.",
        })}
      </p>
      {experiences.length ? (
        experiences.map((experience) => (
          <div data-h2-margin-bottom="base(x.5)" key={experience.id}>
            <ExperienceCard
              experience={experience}
              headingLevel={contentHeadingLevel}
              showEdit={false}
              showSkills={skill}
            />
          </div>
        ))
      ) : (
        <p data-h2-margin-bottom="base(x.5)" data-h2-margin-left="base(x.25)">
          {intl.formatMessage(commonMessages.notFound)}
        </p>
      )}
    </>
  );
};

interface ScreeningDecisionDialogProps {
  assessmentStep: AssessmentStep;
  poolCandidate: PoolCandidate;
  hasBeenAssessed: boolean;
  poolSkill?: PoolSkill;
  initialValues?: FormValues;
  educationRequirement?: boolean;
  onSubmit: SubmitHandler<FormValues>;
  isOpen: boolean;
  onOpenChanged: (newOpen: boolean) => void;
}

export const ScreeningDecisionDialog = ({
  assessmentStep,
  poolCandidate,
  hasBeenAssessed,
  poolSkill,
  initialValues,
  educationRequirement,
  onSubmit,
  isOpen,
  onOpenChanged,
}: ScreeningDecisionDialogProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const dialogType = useDialogType(
    educationRequirement ? undefined : assessmentStep,
  );
  const skill = poolSkill?.skill ? poolSkill.skill : undefined;
  const skillLevel = getSkillLevelMessage(poolSkill, intl);

  const parsedSnapshot: Maybe<User> = JSON.parse(poolCandidate.profileSnapshot);
  const snapshotCandidate = parsedSnapshot?.poolCandidates
    ?.filter(notEmpty)
    .find(({ id }) => id === poolCandidate.id);

  const headers = useHeaders({
    type: dialogType,
    title: intl.formatMessage(
      assessmentStep?.type
        ? getAssessmentStepType(assessmentStep?.type)
        : commonMessages.notApplicable,
    ),
    customTitle: getLocalizedName(assessmentStep?.title, intl, true),
    candidateName: parsedSnapshot?.firstName,
    skillName: getLocalizedName(skill?.name, intl),
    skillLevel,
  });
  const labels = useLabels();

  const experiences =
    dialogType === "EDUCATION"
      ? snapshotCandidate?.educationRequirementExperiences?.filter(notEmpty) ||
        []
      : getExperienceSkills(
          parsedSnapshot?.experiences?.filter(notEmpty) || [],
          skill,
        );

  const experienceAttachedToSkill =
    getExperienceSkills(unpackMaybes(parsedSnapshot?.experiences), skill)
      .length > 0;

  const classificationGroup = poolCandidate.pool.classification?.group;

  const educationRequirementOption = getEducationRequirementOptions(
    intl,
    locale,
    classificationGroup,
    isIAPPool(poolCandidate.pool),
  ).find(
    (option) => option.value === snapshotCandidate?.educationRequirementOption,
  )?.label;

  const defaultValues: FormValues = {
    assessmentDecision: null,
    assessmentDecisionLevel: null,
    justifications: null,
    skillDecisionNotes: null,
  };

  const triggerColor = (): Color => {
    if (
      initialValues?.assessmentDecision === AssessmentDecision.Unsuccessful &&
      poolSkill?.type === PoolSkillType.Nonessential
    )
      return "black";
    if (!hasBeenAssessed)
      return poolSkill?.type === PoolSkillType.Nonessential &&
        !experienceAttachedToSkill
        ? "black"
        : "warning";
    switch (initialValues?.assessmentDecision) {
      case AssessmentDecision.Successful:
        return "success";
      case AssessmentDecision.Hold:
        return "secondary";
      case AssessmentDecision.Unsuccessful:
        return "error";
      default:
        return "black";
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChanged}>
      <Dialog.Trigger>
        <Button
          type="button"
          mode="inline"
          color={triggerColor()}
          data-h2-text-align="base(left)"
        >
          {hasBeenAssessed ? (
            <span>
              {initialValues?.assessmentDecision === "noDecision" ? (
                <>{intl.formatMessage(commonMessages.notSure)}</>
              ) : (
                <>
                  <>
                    {intl.formatMessage(
                      initialValues?.assessmentDecision
                        ? getTableAssessmentDecision(
                            initialValues.assessmentDecision,
                          )
                        : commonMessages.notFound,
                    )}
                  </>
                  {initialValues?.assessmentDecision ===
                    AssessmentDecision.Successful && !educationRequirement ? (
                    <span
                      data-h2-color="base(gray.darker)"
                      data-h2-text-decoration="base(none)"
                      data-h2-display="base(block)"
                    >
                      {intl.formatMessage(
                        initialValues?.assessmentDecisionLevel
                          ? getAssessmentDecisionLevel(
                              initialValues.assessmentDecisionLevel,
                            )
                          : commonMessages.notFound,
                      )}
                    </span>
                  ) : null}
                </>
              )}
            </span>
          ) : (
            <>
              {intl.formatMessage(
                poolSkill?.type === PoolSkillType.Nonessential &&
                  !experienceAttachedToSkill
                  ? poolCandidateMessages.unclaimed
                  : poolCandidateMessages.toAssess,
              )}
            </>
          )}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header subtitle={headers.subtitle}>
          {headers.title}
        </Dialog.Header>
        <Dialog.Body>
          <AssessmentStepTypeSection
            educationRequirementOption={educationRequirementOption}
            poolSkill={poolSkill}
            type={dialogType}
          />
          {dialogType === "SCREENING_QUESTIONS" ? (
            <ScreeningQuestions poolCandidate={snapshotCandidate} />
          ) : (
            <SupportingEvidence experiences={experiences} skill={skill} />
          )}
          <BasicForm
            onSubmit={onSubmit}
            labels={labels}
            options={{
              defaultValues: initialValues || defaultValues,
            }}
          >
            <ScreeningDecisionDialogForm dialogType={dialogType} />
            <Dialog.Footer>
              <Submit
                color="secondary"
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

const CreateAssessmentResult_Mutation = graphql(/* GraphQL */ `
  mutation CreateAssessmentResult(
    $createAssessmentResult: CreateAssessmentResultInput!
  ) {
    createAssessmentResult(createAssessmentResult: $createAssessmentResult) {
      id
    }
  }
`);

const UpdateAssessmentResult_Mutation = graphql(/* GraphQL */ `
  mutation UpdateAssessmentResult(
    $updateAssessmentResult: UpdateAssessmentResultInput!
  ) {
    updateAssessmentResult(updateAssessmentResult: $updateAssessmentResult) {
      id
    }
  }
`);

const ScreeningDecisionDialogApi = ({
  assessmentStep,
  poolCandidate,
  assessmentResult,
  poolSkillToAssess,
  educationRequirement,
}: {
  assessmentStep: AssessmentStep;
  poolCandidate: PoolCandidate;
  assessmentResult?: AssessmentResult;
  poolSkillToAssess?: PoolSkill;
  educationRequirement?: boolean;
}) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState<boolean>(false);

  const assessmentResultId = assessmentResult?.id;
  const poolSkill = assessmentResult?.poolSkill ?? poolSkillToAssess;
  const assessmentResultType = educationRequirement
    ? AssessmentResultType.Education
    : AssessmentResultType.Skill;

  const hasBeenAssessed = !!assessmentResultId;
  let assessmentDecision: Maybe<AssessmentDecision> | "noDecision" | undefined;
  if (hasBeenAssessed) {
    assessmentDecision = assessmentResult?.assessmentDecision || "noDecision";
  } else {
    assessmentDecision = assessmentResult?.assessmentDecision;
  }

  const initialValues: FormValues = {
    assessmentDecision,
    assessmentDecisionLevel: assessmentResult?.assessmentDecisionLevel,
    justifications: assessmentResult?.justifications?.some(
      (justification) =>
        justification ===
          AssessmentResultJustification.EducationAcceptedInformation ||
        justification ===
          AssessmentResultJustification.EducationAcceptedCombinationEducationWorkExperience ||
        justification ===
          AssessmentResultJustification.EducationAcceptedWorkExperienceEquivalency,
    )
      ? assessmentResult.justifications[0]
      : assessmentResult?.justifications,
    skillDecisionNotes: assessmentResult?.skillDecisionNotes,
  };

  const [, executeCreateMutation] = useMutation(
    CreateAssessmentResult_Mutation,
  );
  const [, executeUpdateMutation] = useMutation(
    UpdateAssessmentResult_Mutation,
  );

  const toastSuccess = () =>
    toast.success(
      intl.formatMessage({
        defaultMessage: "Assessment successfully saved.",
        id: "+jknvj",
        description:
          "Message displayed to user if the assessment result was saved successfully.",
      }),
    );
  const toastError = () =>
    toast.error(
      intl.formatMessage({
        defaultMessage: "Failed to save the assessment",
        id: "xcsYTa",
        description:
          "Message displayed to user if assessment result fails to get created/updated.",
      }),
    );

  const handleCreateAssessment = async (
    createAssessmentResult: CreateAssessmentResultInput,
  ) => {
    await executeCreateMutation({ createAssessmentResult })
      .then((result) => {
        if (result.data?.createAssessmentResult?.id) {
          toastSuccess();
          setOpen(false);
        } else {
          toastError();
        }
      })
      .catch(() => {
        toastError();
      });
  };
  const handleUpdateAssessment = async (
    updateAssessmentResult: UpdateAssessmentResultInput,
  ) => {
    await executeUpdateMutation({ updateAssessmentResult })
      .then((result) => {
        if (result.data?.updateAssessmentResult?.id) {
          toastSuccess();
          setOpen(false);
        } else {
          toastError();
        }
      })
      .catch(() => {
        toastError();
      });
  };

  return (
    <ScreeningDecisionDialog
      isOpen={isOpen}
      onOpenChanged={setOpen}
      poolCandidate={poolCandidate}
      assessmentStep={assessmentStep}
      poolSkill={poolSkill}
      initialValues={initialValues}
      hasBeenAssessed={hasBeenAssessed}
      educationRequirement={educationRequirement}
      onSubmit={(formValues) =>
        hasBeenAssessed
          ? handleUpdateAssessment(
              convertFormValuesToApiUpdateInput({
                formValues,
                assessmentResultId,
                assessmentResultType,
              }),
            )
          : handleCreateAssessment(
              convertFormValuesToApiCreateInput({
                formValues,
                assessmentResultType,
                assessmentStepId: assessmentStep.id,
                poolCandidateId: poolCandidate.id,
                poolSkillId: poolSkill?.id || "",
              }),
            )
      }
    />
  );
};

export default ScreeningDecisionDialogApi;
