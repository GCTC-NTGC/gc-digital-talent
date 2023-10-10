import React from "react";
import { useIntl } from "react-intl";

import { Heading, HeadingRank } from "@gc-digital-talent/ui";
import { UserSkill } from "@gc-digital-talent/graphql";

interface SkillShowcaseSectionProps {
  headingLevel: HeadingRank;
  topTechnicalSkillsRanking: UserSkill[];
  topBehaviouralSkillsRanking: UserSkill[];
  improveTechnicalSkillsRanking: UserSkill[];
  improveBehaviouralSkillsRanking: UserSkill[];
}

const SkillShowcaseSection = ({
  headingLevel,
  topTechnicalSkillsRanking,
  topBehaviouralSkillsRanking,
  improveTechnicalSkillsRanking,
  improveBehaviouralSkillsRanking,
}: SkillShowcaseSectionProps) => {
  const intl = useIntl();

  return (
    <>
      <p data-h2-margin-bottom="base(x1)">
        {intl.formatMessage({
          defaultMessage:
            "The skill showcase allows a candidate to provide a curated series of lists that highlight their specific strengths, weaknesses, and skill growth opportunities. These lists can provide you with insight into a candidate's broader skillset and where they might be interested in learning new skills.",
          id: "OM75j3",
          description: "Lead in text for a users skill showcase for admins.",
        })}
      </p>
      <Heading level={headingLevel}>
        {intl.formatMessage({
          defaultMessage: "The candidate's top skills",
          id: "ZyA0CC",
          description: "Heading for a users top skills",
        })}
      </Heading>
      <Heading level={headingLevel}>
        {intl.formatMessage({
          defaultMessage: "Skills the candidate would like to improve",
          id: "1bWLa3",
          description: "Heading for a users skills they would like to improve",
        })}
      </Heading>
    </>
  );
};

export default SkillShowcaseSection;
