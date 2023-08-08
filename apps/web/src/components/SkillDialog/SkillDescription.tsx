import React from "react";
import { useIntl } from "react-intl";

import { Well, Heading } from "@gc-digital-talent/ui";
import { getLocalizedName, useLocale } from "@gc-digital-talent/i18n";

import { Maybe, Skill } from "~/api/generated";

interface SkillDescriptionProps {
  skill?: Maybe<Skill>;
}

const SkillDescription = ({ skill }: SkillDescriptionProps) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const description = getLocalizedName(skill?.description, intl, locale);

  if (!skill || !description) {
    return null;
  }

  return (
    <Well>
      <Heading
        level="h3"
        size="h6"
        data-h2-font-size="base(copy)"
        data-h2-font-weight="base(700)"
        data-h2-margin-top="base(0)"
      >
        {intl.formatMessage(
          {
            defaultMessage: "{skill} is defined as:",
            id: "Ok+Ojl",
            description: "Heading for a specific skills definition",
          },
          {
            skill: getLocalizedName(skill.name, intl, locale),
          },
        )}
      </Heading>
      <p>{description}</p>
    </Well>
  );
};

export default SkillDescription;
