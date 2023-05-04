import React from "react";
import { useIntl } from "react-intl";

import {
  Button,
  CardBasic,
  Heading,
  TreeView,
  Well,
  HeadingLevel,
  Accordion,
} from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import { Experience, Skill } from "~/api/generated";
import { getExperienceSkills } from "~/utils/skillUtils";
import ExperienceAccordion from "~/components/ExperienceAccordion/ExperienceAccordion";

import SkillFormDialog from "./SkillFormDialog";

interface SkillTreeProps {
  skill: Skill;
  experiences: Experience[];
  headingAs?: HeadingLevel;
}

const SkillTree = ({ skill, experiences, headingAs }: SkillTreeProps) => {
  const intl = useIntl();
  const [isFormOpen, setIsFormOpen] = React.useState<boolean>(false);

  const title = getLocalizedName(skill.name, intl);
  const skillExperiences = getExperienceSkills(experiences, skill);
  const availableExperiences = experiences.filter(
    (exp) =>
      !skillExperiences.find(
        (existingExperience) => existingExperience.id === exp.id,
      ),
  );

  return (
    <>
      <TreeView.Root data-h2-margin="base(x2 0)">
        <TreeView.Head>
          <CardBasic>
            <Heading
              level={headingAs || "h4"}
              size="h6"
              data-h2-margin-top="base(0)"
            >
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
                <div data-h2-margin="base(-x.5, 0)">
                  <Accordion.Root type="single" collapsible>
                    <ExperienceAccordion
                      experience={experience}
                      headingLevel="h5"
                    />
                  </Accordion.Root>
                </div>
              </TreeView.Item>
            ))}
          </>
        ) : (
          <TreeView.Item>
            <Well color="warning">
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "This required skill must have at least 1 résumé experience associated with it.",
                  id: "x8tCSM",
                  description:
                    "Message that appears when a required skill has no experiences linked to it",
                })}
              </p>
            </Well>
          </TreeView.Item>
        )}
        {availableExperiences.length > 0 ? (
          <TreeView.Item>
            <Button
              type="button"
              color="secondary"
              mode="solid"
              onClick={() => setIsFormOpen(true)}
            >
              {intl.formatMessage(
                {
                  defaultMessage:
                    "Connect a résumé experience<hidden> to {skillName}</hidden>",
                  id: "NgHjK8",
                  description:
                    "Button text to open form to connect an experience to a skill",
                },
                { skillName: title },
              )}
            </Button>
          </TreeView.Item>
        ) : null}
      </TreeView.Root>
      <SkillFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        skill={skill}
        availableExperiences={availableExperiences}
      />
    </>
  );
};

export default SkillTree;
