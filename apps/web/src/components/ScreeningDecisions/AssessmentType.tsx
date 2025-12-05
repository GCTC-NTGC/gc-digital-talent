import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Accordion, Notice } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getSkillLevelDefinition,
} from "@gc-digital-talent/i18n";

import { ClassificationGroup } from "~/types/classificationGroup";

import { DialogType } from "./useDialogType";
import {
  DIALOG_TYPE,
  getEducationRequirementLabel,
  getSkillLevelMessage,
} from "./utils";

const ScreeningDialogAssessmentType_Fragment = graphql(/** GraphQL */ `
  fragment ScreeningDialogAssessmentType on PoolCandidate {
    pool {
      classification {
        group
      }
      publishingGroup {
        value
      }
    }
    educationRequirementOption {
      value
    }
  }
`);

const ScreeningDialogAssessmentTypePoolSkill_Fragment = graphql(/** GraphQL */ `
  fragment ScreeningDialogAssessmentTypePoolSkill on PoolSkill {
    requiredLevel
    skill {
      name {
        localized
      }
      description {
        localized
      }
      category {
        value
      }
    }
  }
`);

interface AssessmentTypeProps {
  candidateQuery?: FragmentType<typeof ScreeningDialogAssessmentType_Fragment>;
  poolSkillQuery?: FragmentType<
    typeof ScreeningDialogAssessmentTypePoolSkill_Fragment
  >;
  dialogType: DialogType;
}

const AssessmentType = ({
  candidateQuery,
  poolSkillQuery,
  dialogType,
}: AssessmentTypeProps) => {
  const intl = useIntl();
  const candidate = getFragment(
    ScreeningDialogAssessmentType_Fragment,
    candidateQuery,
  );

  const educationRequirementOption = getEducationRequirementLabel({
    group: candidate?.pool.classification?.group as ClassificationGroup,
    publishingGroup: candidate?.pool.publishingGroup?.value,
    educationRequirementOption: candidate?.educationRequirementOption?.value,
    intl,
  });

  if (dialogType === DIALOG_TYPE.Education) {
    return (
      <>
        <p className="mb-3">
          {intl.formatMessage({
            defaultMessage: "Selected requirement option:",
            id: "FS4Dg5",
            description:
              "Header for selected requirement option in education requirement screening decision dialog.",
          })}
        </p>
        {educationRequirementOption ? (
          <Notice.Root className="mb-6 text-left">
            <Notice.Content>{educationRequirementOption}</Notice.Content>
          </Notice.Root>
        ) : (
          <p className="mb-3 ml-1.5">
            {intl.formatMessage(commonMessages.notFound)}
          </p>
        )}
      </>
    );
  }

  const poolSkill = getFragment(
    ScreeningDialogAssessmentTypePoolSkill_Fragment,
    poolSkillQuery,
  );

  const skillName =
    poolSkill?.skill?.name.localized ??
    intl.formatMessage(commonMessages.notAvailable);

  const skillLevel = getSkillLevelMessage(intl, {
    requiredLevel: poolSkill?.requiredLevel,
    skill: poolSkill?.skill,
  });

  return (
    <Notice.Root className="mb-6 text-center">
      <Notice.Content>
        <Accordion.Root type="single" collapsible>
          <Accordion.Item value="skill">
            <Accordion.Trigger>
              {skillLevel
                ? intl.formatMessage(
                    {
                      defaultMessage: `See definitions for "{skillName}" and "{skillLevel}"`,
                      id: "o5zW6Y",
                      description:
                        "Accordion title for skill and skill level header on screening decision dialog.",
                    },
                    { skillName, skillLevel },
                  )
                : intl.formatMessage(
                    {
                      defaultMessage: `See definitions for "{skillName}"`,
                      id: "ZZpC8s",
                      description:
                        "Accordion title for skill header on screening decision dialog.",
                    },
                    { skillName },
                  )}
            </Accordion.Trigger>
            <Accordion.Content className="text-left">
              <p className="mb-6 font-bold">{skillName}</p>
              <p>
                {poolSkill?.skill?.description?.localized ??
                  intl.formatMessage(commonMessages.notAvailable)}
              </p>
              {poolSkill?.requiredLevel && poolSkill.skill?.category.value ? (
                <>
                  <p className="my-6 font-bold">{skillLevel}</p>
                  <p>
                    {intl.formatMessage(
                      getSkillLevelDefinition(
                        poolSkill.requiredLevel,
                        poolSkill.skill.category.value,
                      ),
                    )}
                  </p>
                </>
              ) : null}
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </Notice.Content>
    </Notice.Root>
  );
};

export default AssessmentType;
