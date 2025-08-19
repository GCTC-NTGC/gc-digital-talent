import BuildingLibraryIcon from "@heroicons/react/24/outline/BuildingLibraryIcon";
import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Card, TableOfContents } from "@gc-digital-talent/ui";

import Display from "~/components/Profile/components/GovernmentInformation/Display";
import profileMessages from "~/messages/profileMessages";

const GovernmentInformation_Fragment = graphql(/** GraphQL */ `
  fragment GovernmentInformation on User {
    isGovEmployee
    department {
      name {
        localized
      }
    }
    govEmployeeType {
      value
      label {
        localized
      }
    }
    currentClassification {
      group
      level
    }
    hasPriorityEntitlement
    priorityNumber
    workEmail
    isWorkEmailVerified
  }
`);

interface GovernmentInformationProps {
  query: FragmentType<typeof GovernmentInformation_Fragment>;
}

export const GOV_INFO_ID = "government-information";

const GovernmentInformation = ({ query }: GovernmentInformationProps) => {
  const intl = useIntl();
  const user = getFragment(GovernmentInformation_Fragment, query);

  return (
    <TableOfContents.Section id={GOV_INFO_ID}>
      <TableOfContents.Heading
        icon={BuildingLibraryIcon}
        color="secondary"
        className="mb-6"
      >
        {intl.formatMessage(profileMessages.govEmployeeInformation)}
      </TableOfContents.Heading>
      <Card>
        <Display user={user} />
      </Card>
    </TableOfContents.Section>
  );
};

export default GovernmentInformation;
