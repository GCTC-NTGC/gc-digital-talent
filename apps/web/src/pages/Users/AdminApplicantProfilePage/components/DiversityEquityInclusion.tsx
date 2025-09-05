import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { TableOfContents } from "@gc-digital-talent/ui";

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
  const user = getFragment(DiversityEquityInclusion_Fragment, query);

  return (
    <TableOfContents.Section id={DEI_ID}>
      <Display user={user} />
    </TableOfContents.Section>
  );
};

export default DiversityEquityInclusion;
