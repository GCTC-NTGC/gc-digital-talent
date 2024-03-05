import React from "react";
import { useIntl } from "react-intl";

import { Accordion } from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { Skill, SkillCategory } from "@gc-digital-talent/graphql";

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

  const screeningTime =
    skill.category === SkillCategory.Technical
      ? intl.formatMessage({
          defaultMessage: "Assessed during initial application",
          id: "gLNQYB",
          description:
            "Message displayed for technical skills telling users at what point it will be assessed",
        })
      : intl.formatMessage({
          defaultMessage: "Assessed at a later time",
          id: "PNtGco",
          description:
            "Message displayed for behavioural skills telling users at what point it will be assessed",
        });

  return (
    <Accordion.Item value={skill.id}>
      <Accordion.Trigger
        as="h3"
        context={<Context required={required} />}
        subtitle={screeningTime}
      >
        {getLocalizedName(skill.name, intl)}
      </Accordion.Trigger>
      <Accordion.Content>
        {skill.description && (
          <p>
            <span data-h2-font-weight="base(700)">
              {intl.formatMessage({
                defaultMessage: "Skill definition",
                id: "N44sQc",
                description: "Label for the definition of a specific skill",
              }) + intl.formatMessage(commonMessages.dividingColon)}
            </span>
            {getLocalizedName(skill.description, intl)}
          </p>
        )}
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default SkillAccordion;
