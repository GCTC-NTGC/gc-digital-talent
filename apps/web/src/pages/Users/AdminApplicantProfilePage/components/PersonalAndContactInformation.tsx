import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Card, TableOfContents } from "@gc-digital-talent/ui";

import Display from "~/components/Profile/components/PersonalInformation/Display";
import profileMessages from "~/messages/profileMessages";

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
  const intl = useIntl();
  const user = getFragment(PersonalAndContactInformation_Fragment, query);

  return (
    <TableOfContents.Section id={PERSONAL_CONTACT_INFO_ID}>
      <TableOfContents.Heading
        icon={UserCircleIcon}
        color="secondary"
        className="mt-0 mb-6"
      >
        {intl.formatMessage(profileMessages.personalAndContactInformation)}
      </TableOfContents.Heading>
      <Card>
        <Display query={user} showEmailVerification readOnly />
      </Card>
    </TableOfContents.Section>
  );
};

export default PersonalAndContactInformation;
