import ChartPieIcon from "@heroicons/react/24/outline/ChartPieIcon";
import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Heading, TableOfContents } from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import SkillRankCard from "~/components/SkillRankCard/SkillRankCard";
import skillMessages from "~/messages/skillMessages";

const AdminUserSkillShowcase_Fragment = graphql(/** GraphQL */ `
  fragment AdminUserSkillShowcase on User {
    topTechnicalSkillsRanking {
      ...SkillRankCard
    }
    topBehaviouralSkillsRanking {
      ...SkillRankCard
    }
    improveTechnicalSkillsRanking {
      ...SkillRankCard
    }
    improveBehaviouralSkillsRanking {
      ...SkillRankCard
    }
  }
`);

interface SkillShowcaseProps {
  query: FragmentType<typeof AdminUserSkillShowcase_Fragment>;
}

export const SKILL_SHOWCASE_ID = "skill-showcase";
export const TOP_SKILLS_ID = "top-skills";
export const SKILLS_TO_IMPROVE_ID = "to-improve-skills";

const SkillShowcase = ({ query }: SkillShowcaseProps) => {
  const intl = useIntl();
  const user = getFragment(AdminUserSkillShowcase_Fragment, query);

  return (
    <TableOfContents.Section id={SKILL_SHOWCASE_ID}>
      <TableOfContents.Heading
        icon={ChartPieIcon}
        color="secondary"
        className="mb-6"
      >
        {intl.formatMessage(navigationMessages.skillShowcase)}
      </TableOfContents.Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "A curated list from the skills portfolio that presents a more focused and personalized story about this user's strengths and areas of interest.",
          id: "F9CQ6E",
          description: "Description of a users skill showcase",
        })}
      </p>
      <TableOfContents.Section id={TOP_SKILLS_ID}>
        <Heading level="h3" size="h4" className="font-bold">
          {intl.formatMessage(navigationMessages.topSkills)}
        </Heading>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "This section allows the user to feature the skills that they're strongest in. They're able to specify up to 5 behavioural skills and up to 10 technical skills to help create a holistic picture of their talent.",
            id: "gJ5Ubm",
            description: "Description of a users top skills",
          })}
        </p>
        <div className="mb-18 grid gap-3 sm:grid-cols-2">
          <SkillRankCard
            type="top"
            query={unpackMaybes(user.topBehaviouralSkillsRanking)}
            title={intl.formatMessage(skillMessages.behaviouralSkills)}
          />
          <SkillRankCard
            type="top"
            query={unpackMaybes(user.topTechnicalSkillsRanking)}
            title={intl.formatMessage(skillMessages.technicalSkills)}
          />
        </div>
      </TableOfContents.Section>
      <TableOfContents.Section id={SKILLS_TO_IMPROVE_ID}>
        <Heading level="h3" size="h4" className="font-bold">
          {intl.formatMessage(navigationMessages.skillsToImprove)}
        </Heading>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "These skills are not weaknesses, they are skills the user is interested in improving through experience or training.",
            id: "ygC00w",
            description: "Description of a users skills to be improved",
          })}
        </p>
        <div className="mb-18 grid gap-3 xs:grid-cols-2">
          <SkillRankCard
            type="improve"
            query={unpackMaybes(user.improveBehaviouralSkillsRanking)}
            title={intl.formatMessage(skillMessages.behaviouralSkills)}
          />
          <SkillRankCard
            type="improve"
            query={unpackMaybes(user.improveTechnicalSkillsRanking)}
            title={intl.formatMessage(skillMessages.technicalSkills)}
          />
        </div>
      </TableOfContents.Section>
    </TableOfContents.Section>
  );
};

export default SkillShowcase;
