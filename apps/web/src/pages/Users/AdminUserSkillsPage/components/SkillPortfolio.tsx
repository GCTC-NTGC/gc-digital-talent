import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { TableOfContents } from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import SkillPortfolioTable from "~/components/SkillsPortfolioTable/SkillPortfolioTable";

const AdminUserSkills_Fragment = graphql(/** GraphQL */ `
  fragment AdminUserSkillPortfolio on UserSkill {
    ...SkillPortfolioTable_UserSkill
  }
`);

interface SkillPortfolioProps {
  query: FragmentType<typeof AdminUserSkills_Fragment>[];
}

export const SKILL_PORTFOLIO_ID = "skills-portfolio";

const SkillPortfolio = ({ query }: SkillPortfolioProps) => {
  const intl = useIntl();
  const userSkills = getFragment(AdminUserSkills_Fragment, query);

  return (
    <TableOfContents.Section id={SKILL_PORTFOLIO_ID} className="mb-18">
      <TableOfContents.Heading
        icon={BoltIcon}
        color="secondary"
        className="mt-0 mb-6"
      >
        {intl.formatMessage(navigationMessages.skillPortfolio)}
      </TableOfContents.Heading>
      <SkillPortfolioTable
        userSkillsQuery={unpackMaybes(userSkills)}
        readOnly
      />
    </TableOfContents.Section>
  );
};

export default SkillPortfolio;
