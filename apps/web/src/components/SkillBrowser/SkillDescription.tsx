import { useIntl } from "react-intl";

import { Notice } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

interface SkillDescriptionProps {
  name?: string | null;
  description?: string | null;
}

const SkillDescription = ({ name, description }: SkillDescriptionProps) => {
  const intl = useIntl();

  if (!description) {
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
            skill: name ?? intl.formatMessage(commonMessages.notAvailable),
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
