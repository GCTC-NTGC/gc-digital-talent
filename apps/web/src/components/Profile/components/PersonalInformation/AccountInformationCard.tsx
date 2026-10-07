import { useIntl } from "react-intl";

import { Card, Link } from "@gc-digital-talent/ui";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { getRuntimeVariable } from "@gc-digital-talent/env";

import PersonalInfoBox from "~/components/PersonalInfoBox/PersonalInfoBox";

const AccountInformationCard_Fragment = graphql(/** GraphQL */ `
  fragment AccountInformationCard on User {
    id
    email
    isEmailVerified
    ...PersonalInfoBox
  }
`);

interface AccountInformationCardProps {
  query: FragmentType<typeof AccountInformationCard_Fragment>;
}

const AccountInformationCard = ({ query }: AccountInformationCardProps) => {
  const intl = useIntl();
  const data = getFragment(AccountInformationCard_Fragment, query);
  const manageAccountUri =
    getRuntimeVariable("OAUTH_MANAGE_ACCOUNT_URI") ?? "#";

  return (
    <Card space="lg">
      <p className="font-bold">
        {intl.formatMessage({
          defaultMessage: "Account and contact information",
          id: "sx79Vq",
          description:
            "Title for the account and contact information information section",
        })}
      </p>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-200">
        {intl.formatMessage({
          defaultMessage:
            "GC Digital Talent partners with the Government of Canada’s credential service, CanadaLogin, to provide you with account access using a single username and password. You can manage related data on the CanadaLogin website and it will automatically reflect here when you access your account.",
          id: "zU8Wo2",
          description: "Account info card description on account settings page",
        })}
      </p>
      <div className="mb-9">
        <PersonalInfoBox query={data} />
      </div>
      <Card.Separator className="mb-6" />
      <Link href={manageAccountUri} external newTab className="font-bold">
        {intl.formatMessage({
          defaultMessage: "Update CanadaLogin information",
          id: "vdPlPP",
          description: "Link to update your CanadaLogin information",
        })}
      </Link>
    </Card>
  );
};

export default AccountInformationCard;
