import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Card, TableOfContents } from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";

import Display from "~/components/Profile/components/DiversityEquityInclusion/Display";

const DiversityEquityInclusion_Fragment = graphql(/** GraphQL */ `
  fragment DiversityEquityInclusion on User {
    isWoman
    hasDisability
    isVisibleMinority
    indigenousCommunities {
      value
      label {
        localized
      }
    }
  }
`);

interface DiversityEquityInclusionProps {
  query: FragmentType<typeof DiversityEquityInclusion_Fragment>;
}

export const DEI_ID = "diversity-equity-inclusion";

const DiversityEquityInclusion = ({ query }: DiversityEquityInclusionProps) => {
  const intl = useIntl();
  const user = getFragment(DiversityEquityInclusion_Fragment, query);

  return (
    <TableOfContents.Section id={DEI_ID}>
      <TableOfContents.Heading
        icon={UsersIcon}
        color="secondary"
        className="mb-6"
      >
        {intl.formatMessage(navigationMessages.diversityEquityInclusion)}
      </TableOfContents.Heading>
      <Card>
        <Display user={user} />
      </Card>
    </TableOfContents.Section>
  );
};

export default DiversityEquityInclusion;
