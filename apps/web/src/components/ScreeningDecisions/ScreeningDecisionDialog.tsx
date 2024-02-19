import * as React from "react";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";

import {
  AssessmentStep,
  CreateAssessmentResultInput,
  Experience,
  PoolCandidate,
  Skill,
  SkillCategory,
  UpdateAssessmentResultInput,
  UserSkill,
} from "@gc-digital-talent/graphql";
import {
  Accordion,
  Button,
  Dialog,
  HeadingLevel,
  Well,
  incrementHeadingRank,
} from "@gc-digital-talent/ui";
import { BasicForm, Submit } from "@gc-digital-talent/forms";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  getAssessmentStepType,
  getBehaviouralSkillLevelDefinition,
  getLocale,
  getLocalizedName,
  getTechnicalSkillLevelDefinition,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

import { getExperienceSkills } from "~/utils/skillUtils";
import {
  useCreateAssessmentResultMutation,
  useUpdateAssessmentResultMutation,
} from "~/api/generated";
import { getEducationRequirementOptions } from "~/pages/Applications/ApplicationEducationPage/utils";
import { ClassificationGroup, isIAPPool } from "~/utils/poolUtils";

import useLabels from "./useLabels";
import ExperienceCard from "../ExperienceCard/ExperienceCard";
import useDialogType, { DialogType } from "./useDialogType";
import ScreeningDecisionDialogForm from "./ScreeningDecisionDialogForm";
import useHeaders from "./useHeaders";
import {
  convertFormValuesToApiCreateInput,
  convertFormValuesToApiUpdateInput,
  FormValuesToApiCreateInputArgs,
  FormValuesToApiUpdateInputArgs,
  getLocalizedSkillLevel,
  FormValues,
} from "./utils";

const AssessmentStepTypeSection = ({
  type,
  userSkill,
  educationRequirementOption,
}: {
  type: DialogType;
  userSkill?: UserSkill;
  educationRequirementOption: React.ReactNode;
}) => {
  const intl = useIntl();
  const localizedSkillLevel = getLocalizedSkillLevel(userSkill, intl);
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
          <Well
            data-h2-margin-bottom="base(x1)"
            data-h2-text-align="base(left)"
          >
            {educationRequirementOption}
          </Well>
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
                  {intl.formatMessage(
                    {
                      defaultMessage: `See definitions for "{skillName}" and "{skillLevel}"`,
                      id: "o5zW6Y",
                      description:
                        "Accordion title for skill and skill level header on screening decision dialog.",
                    },
                    {
                      skillName: getLocalizedName(userSkill?.skill.name, intl),
                      skillLevel: localizedSkillLevel,
                    },
                  )}
                </Accordion.Trigger>
                <Accordion.Content data-h2-text-align="base(left)">
                  <div data-h2-margin="base(x1, 0)">
                    <p
                      data-h2-margin-bottom="base(x1)"
                      data-h2-font-weight="base(bold)"
                    >
                      {getLocalizedName(userSkill?.skill.name, intl)}
                    </p>
                    <p>
                      {getLocalizedName(userSkill?.skill.description, intl)}
                    </p>
                  </div>
                  <div>
                    {userSkill?.skillLevel && (
                      <>
                        <p
                          data-h2-margin-bottom="base(x1)"
                          data-h2-font-weight="base(bold)"
                        >
                          {localizedSkillLevel}
                        </p>
                        <p>
                          {intl.formatMessage(
                            userSkill.skill.category === SkillCategory.Technical
                              ? getTechnicalSkillLevelDefinition(
                                  userSkill.skillLevel,
                                )
                              : getBehaviouralSkillLevelDefinition(
                                  userSkill.skillLevel,
                                ),
                          )}
                        </p>
                      </>
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
  poolCandidate: PoolCandidate;
}) => {
  const intl = useIntl();
  const screeningQuestions =
    poolCandidate.pool.screeningQuestions?.filter(notEmpty) || [];
  const screeningQuestionResponses =
    poolCandidate.screeningQuestionResponses?.filter(notEmpty) || [];
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
              {
                screeningQuestionResponses.filter(
                  (response) =>
                    response.screeningQuestion?.id === screeningQuestion.id,
                )[0].answer
              }
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
    <div>
      <p data-h2-margin-bottom="base(x.5)">
        {intl.formatMessage({
          defaultMessage: "Supporting evidence:",
          id: "w59dPh",
          description:
            "Header for supporting evidence section in screening decision dialog.",
        })}
      </p>
      {experiences.length
        ? experiences.map((experience) => (
            <div data-h2-margin-bottom="base(x.5)" key={experience.id}>
              <ExperienceCard
                experience={experience}
                headingLevel={contentHeadingLevel}
                showEdit={false}
                showSkills={skill}
              />
            </div>
          ))
        : null}
    </div>
  );
};

interface ScreeningDecisionDialogProps {
  assessmentStep?: AssessmentStep;
  poolCandidate: PoolCandidate;
  skill: Skill;
  initialValues?: FormValues;
  onSubmit: SubmitHandler<FormValues>;
}

export const ScreeningDecisionDialog = ({
  assessmentStep,
  poolCandidate,
  skill,
  initialValues,
  onSubmit,
}: ScreeningDecisionDialogProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const dialogType = useDialogType(assessmentStep);

  const userSkill = poolCandidate.user.userSkills
    ?.filter(notEmpty)
    .find((usrSkill) => usrSkill.skill.id === skill.id);

  const headers = useHeaders({
    type: dialogType,
    title: intl.formatMessage(
      assessmentStep?.type
        ? getAssessmentStepType(assessmentStep?.type)
        : commonMessages.notApplicable,
    ),
    customTitle: getLocalizedName(assessmentStep?.title, intl),
    candidateName: poolCandidate.user.firstName,
    skillName: getLocalizedName(userSkill?.skill.name, intl),
    skillLevel: getLocalizedSkillLevel(userSkill, intl),
  });
  const labels = useLabels();
  const [isOpen, setIsOpen] = React.useState(true);

  const experiences =
    dialogType === "EDUCATION"
      ? poolCandidate.educationRequirementExperiences?.filter(notEmpty) || []
      : getExperienceSkills(
          poolCandidate.user.experiences?.filter(notEmpty) || [],
          skill,
        );

  const handleOpenChange = (newIsOpen: boolean) => {
    setIsOpen(newIsOpen);
  };

  const classificationGroup = poolCandidate.pool.classifications
    ? (poolCandidate.pool.classifications[0]?.group as ClassificationGroup)
    : undefined;

  const educationRequirementOption = getEducationRequirementOptions(
    intl,
    locale,
    classificationGroup,
    isIAPPool(poolCandidate.pool),
  ).find((option) => option.value === poolCandidate.educationRequirementOption)
    ?.label;

  const defaultValues: FormValues = {
    assessmentDecision: null,
    assessmentDecisionLevel: null,
    justifications: null,
    otherJustificationNotes: null,
    skillDecisionNotes: null,
    assessmentNotes: null,
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <Button>
          {intl.formatMessage({
            defaultMessage: "Open",
            id: "1KLw2T",
            description:
              "Header for education requirement screening decision dialog.",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header subtitle={headers.subtitle}>
          {headers.title}
        </Dialog.Header>
        <Dialog.Body>
          <div>
            <AssessmentStepTypeSection
              type={dialogType}
              userSkill={userSkill}
              educationRequirementOption={educationRequirementOption}
            />
            {dialogType === "SCREENING_QUESTIONS" ? (
              <ScreeningQuestions poolCandidate={poolCandidate} />
            ) : (
              <SupportingEvidence experiences={experiences} skill={skill} />
            )}
            <div data-h2-margin="base(x1, 0)">
              <BasicForm
                onSubmit={onSubmit}
                labels={labels}
                options={{ defaultValues: initialValues || defaultValues }}
              >
                <ScreeningDecisionDialogForm dialogType={dialogType} />
                <Dialog.Footer
                  data-h2-display="base(flex)"
                  data-h2-justify-content="base(flex-start)"
                  data-h2-align-items="base(baseline)"
                  data-h2-gap="base(x1)"
                >
                  <Submit
                    color="secondary"
                    data-h2-margin-top="base(x1)"
                    text={intl.formatMessage({
                      defaultMessage: "Save decision",
                      id: "hQ2+aE",
                      description:
                        "Save button label for screening decision dialogs",
                    })}
                    isSubmittingText={intl.formatMessage(commonMessages.saving)}
                  />
                  <Dialog.Close>
                    <Button type="button" mode="inline" color="quaternary">
                      {intl.formatMessage(commonMessages.cancel)}
                    </Button>
                  </Dialog.Close>
                </Dialog.Footer>
              </BasicForm>
            </div>
          </div>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

const ScreeningDecisionDialogApi = ({
  assessmentResultId,
}: {
  assessmentResultId?: string;
}) => {
  const intl = useIntl();
  const [, executeCreateMutation] = useCreateAssessmentResultMutation();
  const [, executeUpdateMutation] = useUpdateAssessmentResultMutation();

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
          // Do something
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
          // Do something
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
      poolCandidate={{} as PoolCandidate} // TODO: Add pool candidate here
      skill={{} as Skill} // TODO: Add skill here
      assessmentStep={{} as AssessmentStep} // TODO: Add assessment step here
      initialValues={{} as FormValues} // TODO: Add assessment result initial values
      onSubmit={(formValues) =>
        assessmentResultId
          ? handleUpdateAssessment(
              convertFormValuesToApiUpdateInput({
                formValues,
              } as FormValuesToApiUpdateInputArgs),
            )
          : handleCreateAssessment(
              convertFormValuesToApiCreateInput({
                formValues,
              } as FormValuesToApiCreateInputArgs),
            )
      }
    />
  );
};

export default ScreeningDecisionDialogApi;
