import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { TableOfContents } from "@gc-digital-talent/ui";

import Display from "~/components/Profile/components/PersonalInformation/Display";

const PersonalAndContactInformation_Fragment = graphql(/** GraphQL */ `
  fragment PersonalAndContactInformation on User {
    ...PersonalInformationDisplay
  }
`);

interface PersonalAndContactInformationProps {
  query: FragmentType<typeof PersonalAndContactInformation_Fragment>;
}

export const PERSONAL_CONTACT_INFO_ID = "personal-contact-information";

const PersonalAndContactInformation = ({
  query,
}: PersonalAndContactInformationProps) => {
  const user = getFragment(PersonalAndContactInformation_Fragment, query);

  return (
    <TableOfContents.Section id={PERSONAL_CONTACT_INFO_ID}>
      <Display query={user} showEmailVerification readOnly showEmail />
    </TableOfContents.Section>
  );
};

export default PersonalAndContactInformation;
