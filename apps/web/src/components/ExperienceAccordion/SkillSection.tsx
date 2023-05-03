import React from "react";
import { useIntl } from "react-intl";

import { getLocalizedName } from "@gc-digital-talent/i18n";
import { HeadingRank } from "@gc-digital-talent/ui";

import { Skill } from "~/api/generated";

import ContentSection from "./ExperienceAccordionContentSection";

interface SkillSectionProps {
  name: Skill["name"];
  record: Skill["experienceSkillRecord"];
  headingLevel?: HeadingRank;
}

const SkillSection = ({ name, record, headingLevel }: SkillSectionProps) => {
  const intl = useIntl();
  const localizedName = getLocalizedName(name, intl);

  return (
    <ContentSection
      title={intl.formatMessage(
        {
          defaultMessage: "How I used “{skillName}” in this role",
          id: "LfhuFi",
          description: "Title for section on how a skill was used in the role",
        },
        {
          skillName: localizedName,
        },
      )}
      headingLevel={headingLevel}
    >
      {record?.details}
    </ContentSection>
  );
};
export default SkillSection;
