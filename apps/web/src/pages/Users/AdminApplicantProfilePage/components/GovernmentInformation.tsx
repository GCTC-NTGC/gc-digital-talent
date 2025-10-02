import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { TableOfContents } from "@gc-digital-talent/ui";

import Display from "~/components/Profile/components/GovernmentInformation/Display";

const GovernmentInformation_Fragment = graphql(/** GraphQL */ `
  fragment GovernmentInformation on User {
    ...GovernmentInformationDisplay
  }
`);

interface GovernmentInformationProps {
  query: FragmentType<typeof GovernmentInformation_Fragment>;
}

export const GOV_INFO_ID = "government-information";

const GovernmentInformation = ({ query }: GovernmentInformationProps) => {
  const user = getFragment(GovernmentInformation_Fragment, query);

  return (
    <TableOfContents.Section id={GOV_INFO_ID}>
      <Display query={user} showEmailVerification readOnly showEmail />
    </TableOfContents.Section>
  );
};

export default GovernmentInformation;
