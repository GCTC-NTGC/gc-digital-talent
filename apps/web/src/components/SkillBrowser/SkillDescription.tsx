import React from "react";
import { useIntl } from "react-intl";

import { Well, Heading } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Maybe, Skill } from "@gc-digital-talent/graphql";

interface SkillDescriptionProps {
  skill?: Maybe<Skill>;
}

const SkillDescription = ({ skill }: SkillDescriptionProps) => {
  const intl = useIntl();
  const description = getLocalizedName(skill?.description, intl);

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
            skill: getLocalizedName(skill.name, intl),
          },
        )}
      </Heading>
      <p>{description}</p>
    </Well>
  );
};

export default SkillDescription;
