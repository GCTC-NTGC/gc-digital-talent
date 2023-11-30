import * as React from "react";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";

import {
  AssessmentResult,
  AssessmentStep,
  AssessmentStepType,
  Experience,
  Maybe,
  PoolCandidate,
  Skill,
  SkillCategory,
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
  getBehaviouralSkillLevel,
  getBehaviouralSkillLevelDefinition,
  getLocalizedName,
  getTechnicalSkillLevel,
  getTechnicalSkillLevelDefinition,
} from "@gc-digital-talent/i18n";

import { getExperienceSkills } from "~/utils/skillUtils";

import useLabels from "./useLabels";
import ExperienceCard from "../ExperienceCard/ExperienceCard";
import useDialogType, { DialogType } from "./useDialogType";
import ScreeningDecisionDialogForm from "./ScreeningDecisionDialogForm";

const AssessmentStepTypeSection = ({
  type,
  userSkill,
}: {
  type: DialogType;
  userSkill: UserSkill;
}) => {
  const intl = useIntl();
  switch (type) {
    case "EDUCATION":
      return (
        <div>
          <p>
            {intl.formatMessage({
              defaultMessage: "Selected requirement option:",
              id: "FS4Dg5",
              description:
                "Header for selected requirement option in education requirement screening decision dialog.",
            })}
          </p>
          <Well
            data-h2-margin-bottom="base(x1)"
            data-h2-text-align="base(center)"
          >
            **REPLACE WITH EDUCATION REQUIREMENT STATEMENT**
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
                  {intl.formatMessage({
                    defaultMessage: `See definitions for "{skill}" and "{skillLevel}"`,
                    id: "+xjIMK",
                    description:
                      "Accordian title for skill and skill level header on screening decision dialog.",
                  })}
                </Accordion.Trigger>
                <Accordion.Content>
                  <div data-h2-margin-bottom="base(x1)">
                    <p>{getLocalizedName(userSkill.skill.name, intl)}</p>
                    <p>{getLocalizedName(userSkill.skill.description, intl)}</p>
                  </div>
                  <div>
                    {userSkill.skillLevel && (
                      <>
                        <p>
                          {intl.formatMessage(
                            userSkill.skill.category === SkillCategory.Technical
                              ? getTechnicalSkillLevel(userSkill.skillLevel)
                              : getBehaviouralSkillLevel(userSkill.skillLevel),
                          )}
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

const SupportingEvidence = ({
  experiences,
  skill,
  headingAs = "h4",
}: {
  experiences: Experience[];
  skill?: Skill;
  headingAs?: HeadingLevel;
}) => {
  const contentHeadingLevel = incrementHeadingRank(headingAs);
  return (
    <div>
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

type FormValues = {
  assessmentDecision: AssessmentResult["assessmentDecision"];
  justifications: AssessmentResult["justifications"];
};

interface ScreeningDecisionDialogProps {
  assessmentStep?: AssessmentStep;
  poolCandidate: PoolCandidate;
  skill?: Skill;
  onSubmit: SubmitHandler<FormValues>;
}

const ScreeningDecisionDialog = ({
  assessmentStep,
  poolCandidate,
  skill,
  onSubmit,
}: ScreeningDecisionDialogProps) => {
  const intl = useIntl();
  const dialogType = useDialogType(assessmentStep);
  const labels = useLabels({ type: assessmentStep?.type });
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
        <Dialog.Header subtitle={labels.subtitle}>{labels.title}</Dialog.Header>
        <Dialog.Body>
          <div>
            <AssessmentStepTypeSection type={assessmentStep?.type} />
            <SupportingEvidence experiences={experiences} skill={skill} />
            <div data-h2-margin="base(x1, 0)">
              <BasicForm onSubmit={onSubmit} labels={labels}>
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

export default ScreeningDecisionDialog;
