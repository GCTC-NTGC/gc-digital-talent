import React from "react";
import { useIntl } from "react-intl";

import { Accordion, Well } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import { Skill } from "~/api/generated";

interface SkillAccordionProps {
  skills: Skill[];
  nullMessage: string;
}

const SkillAccordion = ({ skills, nullMessage }: SkillAccordionProps) => {
  const intl = useIntl();
  if (!skills.length) {
    return (
      <Well>
        <p>{nullMessage}</p>
      </Well>
    );
  }

  return (
    <Accordion.Root type="single" size="sm" mode="card" collapsible>
      {skills.map((skill) => (
        <Accordion.Item key={skill.id} value={skill.id}>
          <Accordion.Trigger as="h5">
            {getLocalizedName(skill.name, intl)}
          </Accordion.Trigger>
          <Accordion.Content>
            {getLocalizedName(skill.description, intl)}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};

export default SkillAccordion;
