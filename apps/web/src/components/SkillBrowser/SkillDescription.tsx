import { useIntl } from "react-intl";

import { Notice } from "@gc-digital-talent/ui";
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
    <Notice.Root>
      <Notice.Title as="h3">
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
      </Notice.Title>
      <Notice.Content>
        <p>{description}</p>
      </Notice.Content>
    </Notice.Root>
  );
};

export default SkillDescription;
