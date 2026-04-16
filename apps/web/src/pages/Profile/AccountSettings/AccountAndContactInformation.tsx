import { useIntl } from "react-intl";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import type { ReactNode } from "react";

import {
  Card,
  CardSeparator,
  Link,
  Notice,
  TableOfContents,
} from "@gc-digital-talent/ui";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { getRuntimeVariable } from "@gc-digital-talent/env";

import { getFullNameLabel } from "~/utils/nameUtils";

const AccountAndContactInformation_Fragment = graphql(/** GraphQL */ `
  fragment AccountAndContactInformation on User {
    id
    firstName
    lastName
    telephone
    email
    preferredLang {
      value
      label {
        localized
      }
    }
  }
`);

interface AccountAndContactInformationProps {
  personalInfoQuery: FragmentType<typeof AccountAndContactInformation_Fragment>;
}

const AccountAndContactInformation = ({
  personalInfoQuery,
}: AccountAndContactInformationProps) => {
  const intl = useIntl();
  const manageAccountUri = getRuntimeVariable("OAUTH_MANAGE_ACCOUNT_URI");

  const personalInfo = getFragment(
    AccountAndContactInformation_Fragment,
    personalInfoQuery,
  );

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
            a: (chunks: ReactNode) => {
              return manageAccountUri ? (
                <Link href={manageAccountUri} color="black">
                  {chunks}
                </Link>
              ) : (
                <span>{chunks}</span>
              );
            },
          },
        )}
      </div>
      <Notice.Root className="mb-9">
        <Notice.Title>
          {getFullNameLabel(
            personalInfo.firstName,
            personalInfo.lastName,
            intl,
          )}
        </Notice.Title>
        <Notice.Content>
          {personalInfo.email ? (
            <p>
              <Link href={`mailto:${personalInfo.email}`} color="black">
                {personalInfo.email}
              </Link>
            </p>
          ) : null}

          {personalInfo.telephone ? <p>{personalInfo.telephone}</p> : null}
          <p>
            {intl.formatMessage({
              defaultMessage: "Preferred contact language",
              id: "AumMAr",
              description:
                "Legend text for required language preference in getting started form",
            }) +
              intl.formatMessage(commonMessages.dividingColon) +
              personalInfo.preferredLang?.label.localized}
          </p>
        </Notice.Content>
      </Notice.Root>
      {manageAccountUri ? (
        <>
          <CardSeparator space="lg" orientation="horizontal" className="my-0" />
          <div className="mt-6">
            <Link href={manageAccountUri} external newTab className="font-bold">
              {intl.formatMessage({
                defaultMessage: "Update CanadaLogin information",
                id: "vdPlPP",
                description: "Link to update your CanadaLogin information",
              })}
            </Link>
          </div>
        </>
      ) : null}
    </Card>
  );
};

export default AccountAndContactInformation;
