import { useIntl } from "react-intl";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import type { ReactNode } from "react";

import { Card, Link, Separator, TableOfContents } from "@gc-digital-talent/ui";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { getRuntimeVariable } from "@gc-digital-talent/env";

import PersonalInfoBox from "~/components/PersonalInfoBox/PersonalInfoBox";

const AccountAndContactInformation_Fragment = graphql(/** GraphQL */ `
  fragment AccountAndContactInformation on User {
    ...PersonalInfoBox
  }
`);

interface AccountAndContactInformationProps {
  query: FragmentType<typeof AccountAndContactInformation_Fragment>;
}

const AccountAndContactInformation = ({
  query,
}: AccountAndContactInformationProps) => {
  const intl = useIntl();
  const manageAccountUri =
    getRuntimeVariable("OAUTH_MANAGE_ACCOUNT_URI") ?? "#";

  const data = getFragment(AccountAndContactInformation_Fragment, query);

  return (
    <Card space="lg">
      <TableOfContents.Heading
        size="h3"
        icon={UserCircleIcon}
        color="primary"
        className="mt-0 mb-6"
      >
        {intl.formatMessage({
          defaultMessage: "Account and contact information",
          id: "sx79Vq",
          description:
            "Title for the account and contact information information section",
        })}
      </TableOfContents.Heading>
      <div className="mb-6">
        {intl.formatMessage(
          {
            defaultMessage:
              "GC Digital Talent partners with the Government of Canada’s credential service, CanadaLogin, to provide you with account access using a single username and password. You can <a>manage related data on the CanadaLogin website</a> and it will automatically reflect here when you access your account.",
            id: "zLaAer",
            description: "Description for the account and information section",
          },
          {
            a: (chunks: ReactNode) => (
              <Link href={manageAccountUri} color="black">
                {chunks}
              </Link>
            ),
          },
        )}
      </div>
      <div className="mb-9">
        <PersonalInfoBox query={data} />
      </div>
      <div className="-x-6 sm:-mx-9" /*Match card padding*/>
        <Separator space="none" orientation="horizontal" decorative />
      </div>
      <div className="mt-6">
        <Link href={manageAccountUri} external newTab className="font-bold">
          {intl.formatMessage({
            defaultMessage: "Update CanadaLogin information",
            id: "vdPlPP",
            description: "Link to update your CanadaLogin information",
          })}
        </Link>
      </div>
    </Card>
  );
};

export default AccountAndContactInformation;
