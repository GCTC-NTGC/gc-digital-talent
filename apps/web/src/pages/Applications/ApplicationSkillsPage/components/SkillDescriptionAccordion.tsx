import React from "react";
import { useIntl } from "react-intl";

import { Accordion } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import { Skill } from "~/api/generated";

interface SkillDescriptionAccordionProps {
  skills: Skill[];
}

const SkillDescriptionAccordion = ({
  skills,
}: SkillDescriptionAccordionProps) => {
  const intl = useIntl();

  if (!skills.length) {
    return null;
  }

  return (
    <Accordion.Root type="single" collapsible>
      {skills.map((skill) => (
        <Accordion.Item key={skill.id} value={skill.id}>
          <Accordion.Trigger as="h4" size="sm">
            {getLocalizedName(skill.name, intl)}
          </Accordion.Trigger>
          <Accordion.Content>
            <p>{getLocalizedName(skill.description, intl)}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};

export default SkillDescriptionAccordion;
