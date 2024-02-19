import React from "react";
import { useIntl } from "react-intl";

import { Accordion } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Skill } from "@gc-digital-talent/graphql";

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
    <Accordion.Root mode="card" type="single" size="sm" collapsible>
      {skills.map((skill) => (
        <Accordion.Item key={skill.id} value={skill.id}>
          <Accordion.Trigger as="h4">
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
