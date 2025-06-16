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
      <Heading level="h3" size="h6" className="mt-0 text-base font-bold">
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
