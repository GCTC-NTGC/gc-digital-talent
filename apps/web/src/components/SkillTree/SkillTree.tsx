import { useIntl } from "react-intl";
import { ReactNode } from "react";

import {
  Button,
  CardBasic,
  Heading,
  TreeView,
  Well,
  HeadingLevel,
  incrementHeadingRank,
} from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Experience, Skill } from "@gc-digital-talent/graphql";

import { getExperienceSkills } from "~/utils/skillUtils";
import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";
import ExperienceSkillFormDialog from "~/components/ExperienceSkillFormDialog/ExperienceSkillFormDialog";

const filterExperienceSkills = (
  experience: Omit<Experience, "user">,
  skill: Skill,
) => {
  return {
    ...experience,
    skills: experience.skills?.filter(
      (experienceSkill) => experienceSkill.id === skill.id,
    ),
  };
};

interface SkillTreeProps {
  skill: Skill;
  experiences: Omit<Experience, "user">[];
  headingAs?: HeadingLevel;
  hideConnectButton?: boolean;
  hideEdit?: boolean;
  showDisclaimer?: boolean;
  disclaimerMessage?: ReactNode;
}

const SkillTree = ({
  skill,
  experiences,
  headingAs = "h4",
  disclaimerMessage,
  hideConnectButton = false,
  hideEdit = false,
  showDisclaimer = false,
}: SkillTreeProps) => {
  const intl = useIntl();
  const contentHeadingLevel = incrementHeadingRank(headingAs);

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
        <CardBasic>
          <Heading level={headingAs} size="h6" data-h2-margin-top="base(0)">
            {title}
          </Heading>
          {skill.description && (
            <p>{getLocalizedName(skill.description, intl)}</p>
          )}
        </CardBasic>
      </TreeView.Head>
      {skillExperiences.length ? (
        <>
          {skillExperiences.map((experience) => (
            <TreeView.Item key={experience.id}>
              <ExperienceCard
                experience={filterExperienceSkills(experience, skill)}
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
            availableExperiences={availableExperiences}
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
