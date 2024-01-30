import React from "react";
import { useIntl } from "react-intl";

import { Accordion } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Skill } from "@gc-digital-talent/graphql";

interface ContextProps {
  required?: boolean;
}

const Context = ({ required }: ContextProps) => {
  const intl = useIntl();

  return (
    <span
      data-h2-font-weight="base(700)"
      {...(required
        ? {
            "data-h2-color": "base(primary.darker)",
          }
        : { "data-h2-color": "base(secondary.darker)" })}
    >
      {required
        ? intl.formatMessage({
            defaultMessage: "Required",
            id: "c70xDW",
            description: "Label for a required skill",
          })
        : intl.formatMessage({
            defaultMessage: "Optional",
            id: "iNUK3f",
            description: "Label for an optional skill",
          })}
    </span>
  );
};

interface SkillAccordionProps {
  skill: Skill;
  required?: ContextProps["required"];
}

const SkillAccordion = ({ skill, required }: SkillAccordionProps) => {
  const intl = useIntl();

  return (
    <Accordion.Item value={skill.id}>
      <Accordion.Trigger as="h4" context={<Context required={required} />}>
        {getLocalizedName(skill.name, intl)}
      </Accordion.Trigger>
      <Accordion.Content>
        {getLocalizedName(skill.description, intl)}
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default SkillAccordion;
