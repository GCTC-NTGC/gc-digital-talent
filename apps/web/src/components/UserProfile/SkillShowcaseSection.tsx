import { useIntl } from "react-intl";

import { Heading, HeadingRank } from "@gc-digital-talent/ui";
import { SkillShowcase_UserSkillFragment as SkillShowcaseUserSkillFragmentType } from "@gc-digital-talent/graphql";

import SkillRankCard from "../SkillRankCard/SkillRankCard";

interface SkillShowcaseSectionProps {
  headingLevel: HeadingRank;
  topTechnicalSkillsRanking: SkillShowcaseUserSkillFragmentType[];
  topBehaviouralSkillsRanking: SkillShowcaseUserSkillFragmentType[];
  improveTechnicalSkillsRanking: SkillShowcaseUserSkillFragmentType[];
  improveBehaviouralSkillsRanking: SkillShowcaseUserSkillFragmentType[];
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
      <p className="mb-6">
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
      <div className="mt-12 mb-18 grid gap-3 sm:grid-cols-2">
        <SkillRankCard
          type="top"
          userSkills={topBehaviouralSkillsRanking}
          title={intl.formatMessage({
            defaultMessage: "Behavioural skills",
            id: "NzbVyB",
            description: "Title for the behavioural skill rank card",
          })}
          description={intl.formatMessage({
            defaultMessage:
              'This list allows the candidate to highlight <strong>up to 5 behavioural or "soft" skills</strong> they\'re strongest in.',
            id: "yBXGo6",
            description: "Description of a users top behavioural skills",
          })}
        />
        <SkillRankCard
          type="top"
          userSkills={topTechnicalSkillsRanking}
          title={intl.formatMessage({
            defaultMessage: "Technical skills",
            id: "0ox2XB",
            description: "Title for the technical skill rank card",
          })}
          description={intl.formatMessage({
            defaultMessage:
              "This list allows the candidate to highlight <strong>up to 10 technical skills</strong> that best represent their skillset.",
            id: "icNzuL",
            description: "Description of a users top technical skills",
          })}
        />
      </div>
      <Heading level={headingLevel}>
        {intl.formatMessage({
          defaultMessage: "Skills the candidate would like to improve",
          id: "1bWLa3",
          description: "Heading for a users skills they would like to improve",
        })}
      </Heading>
      <div className="mt-12 mb-18 grid gap-3 sm:grid-cols-2">
        <SkillRankCard
          type="improve"
          userSkills={improveBehaviouralSkillsRanking}
          title={intl.formatMessage({
            defaultMessage: "Behavioural skills",
            id: "NzbVyB",
            description: "Title for the behavioural skill rank card",
          })}
          description={intl.formatMessage({
            defaultMessage:
              'This list allows the candidate to specify <strong>up to 3 behavioural or "soft" skills</strong> that they are actively working to improve.',
            id: "YiqbTc",
            description:
              "Description of a users behavioural skills to improve for admins",
          })}
        />
        <SkillRankCard
          type="improve"
          userSkills={improveTechnicalSkillsRanking}
          title={intl.formatMessage({
            defaultMessage: "Technical skills",
            id: "0ox2XB",
            description: "Title for the technical skill rank card",
          })}
          description={intl.formatMessage({
            defaultMessage:
              "This list allows the candidate to specify <strong>up to 5 technical skills</strong> that they want to receive training in.",
            id: "MTPlbB",
            description:
              "Description of a users technical skills to be improved for admins",
          })}
        />
      </div>
    </>
  );
};

export default SkillShowcaseSection;
