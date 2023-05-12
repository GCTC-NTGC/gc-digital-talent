import React from "react";
import { useIntl } from "react-intl";

import { Accordion, StandardAccordionHeader } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import { Skill } from "~/api/generated";

interface SkillDescriptionAccordionProps {
  skills: Skill[];
}

const SkillDescriptionAccordion = ({
  skills,
}: SkillDescriptionAccordionProps) => {
  const intl = useIntl();

  return (
    <Accordion.Root type="single" mode="simple" collapsible>
      {skills.map((skill) => (
        <Accordion.Item key={skill.id} value={skill.id}>
          <StandardAccordionHeader
            headingAs="h4"
            titleProps={{ "data-h2-font-size": "base(copy)" }}
          >
            {getLocalizedName(skill.name, intl)}
          </StandardAccordionHeader>
          <Accordion.Content>
            <p>{getLocalizedName(skill.description, intl)}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};

export default SkillDescriptionAccordion;
