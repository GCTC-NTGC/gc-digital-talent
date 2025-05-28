import { useIntl } from "react-intl";
import { ReactNode } from "react";

import {
  Button,
  Card,
  Heading,
  TreeView,
  Well,
  HeadingLevel,
  incrementHeadingRank,
} from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import {
  FragmentType,
  getFragment,
  graphql,
  Skill,
} from "@gc-digital-talent/graphql";

import { ExperienceWithSkills, getExperienceSkills } from "~/utils/skillUtils";
import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";
import ExperienceSkillFormDialog from "~/components/ExperienceSkillFormDialog/ExperienceSkillFormDialog";

const filterExperienceSkills = <T extends ExperienceWithSkills>(
  experience: T,
  skill: Skill,
) => {
  return {
    ...experience,
    skills: experience.skills?.filter(
      (experienceSkill) => experienceSkill.id === skill.id,
    ),
  };
};

const SkillTreeExperience_Fragment = graphql(/** GraphQL */ `
  fragment SkillTreeExperience on Experience {
    id
    skills {
      id
    }
    ...ExperienceSkillFormDialogExperience
    ...ExperienceCard
  }
`);

interface SkillTreeProps {
  skill: Skill;
  experiencesQuery: FragmentType<typeof SkillTreeExperience_Fragment>[];
  headingAs?: HeadingLevel;
  hideConnectButton?: boolean;
  hideEdit?: boolean;
  showDisclaimer?: boolean;
  disclaimerMessage?: ReactNode;
}

const SkillTree = ({
  skill,
  experiencesQuery,
  headingAs = "h4",
  disclaimerMessage,
  hideConnectButton = false,
  hideEdit = false,
  showDisclaimer = false,
}: SkillTreeProps) => {
  const intl = useIntl();
  const contentHeadingLevel = incrementHeadingRank(headingAs);
  const experiences = getFragment(
    SkillTreeExperience_Fragment,
    experiencesQuery,
  );

  const title = getLocalizedName(skill.name, intl);
  const skillExperiences = getExperienceSkills(experiences, skill);
  const availableExperiences = experiences.filter(
    (exp) =>
      !skillExperiences.find(
        (existingExperience) => existingExperience.id === exp.id,
      ),
  );

  const disclaimer = showDisclaimer ? (
    <TreeView.Item>
      <Well color="warning">
        {disclaimerMessage ?? (
          <p>
            {intl.formatMessage({
              defaultMessage:
                "This required skill must have at least 1 career timeline experience associated with it.",
              id: "+lSoN3",
              description:
                "Message that appears when a required skill has no experiences linked to it",
            })}
          </p>
        )}
      </Well>
    </TreeView.Item>
  ) : null;

  return (
    <TreeView.Root data-h2-margin="base(x1, 0, 0, 0)">
      <TreeView.Head>
        <Card>
          <Heading level={headingAs} size="h6" data-h2-margin-top="base(0)">
            {title}
          </Heading>
          {skill.description && (
            <p>{getLocalizedName(skill.description, intl)}</p>
          )}
        </Card>
      </TreeView.Head>
      {skillExperiences.length ? (
        <>
          {skillExperiences.map((experience) => (
            <TreeView.Item key={experience.id}>
              <ExperienceCard
                experienceQuery={filterExperienceSkills(experience, skill)}
                headingLevel={contentHeadingLevel}
                showEdit={!hideEdit}
                showSkills={skill}
                linkTo={skill}
                editMode="dialog"
              />
            </TreeView.Item>
          ))}
        </>
      ) : (
        disclaimer
      )}
      {!hideConnectButton && availableExperiences.length > 0 ? (
        <TreeView.Item>
          <ExperienceSkillFormDialog
            skill={skill}
            availableExperiencesQuery={availableExperiences}
            trigger={
              <Button
                type="button"
                color="secondary"
                mode="placeholder"
                data-h2-width="base(100%)"
              >
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "Connect a career timeline experience<hidden> to {skillName}</hidden>",
                    id: "fRwqM9",
                    description:
                      "Button text to open form to connect an experience to a skill",
                  },
                  { skillName: title },
                )}
              </Button>
            }
          />
        </TreeView.Item>
      ) : null}
    </TreeView.Root>
  );
};

export default SkillTree;
