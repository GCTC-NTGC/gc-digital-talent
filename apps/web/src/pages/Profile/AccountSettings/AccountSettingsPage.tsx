import { useIntl, defineMessage } from "react-intl";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";
import { useQuery } from "urql";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import type { ReactNode } from "react";

import {
  Card,
  CardSeparator,
  Container,
  Link,
  NotFound,
  Notice,
  Pending,
  Separator,
  TableOfContents,
} from "@gc-digital-talent/ui";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";
import { getRuntimeVariable } from "@gc-digital-talent/env";

import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import type { Status } from "~/components/StatusItem/StatusItem";
import StatusItem from "~/components/StatusItem/StatusItem";
import messages from "~/messages/profileMessages";
import { getFullNameLabel } from "~/utils/nameUtils";

import AccountManagement from "./AccountManagement";
import NotificationSettings from "./NotificationSettings";

const PersonalInformation_Fragment = graphql(/** GraphQL */ `
  fragment PersonalInformation on User {
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
    enabledEmailNotifications
    enabledInAppNotifications
  }
`);

export type SectionKey =
  | "accountAndContact"
  | "notificationSettings"
  | "accountManagement";

interface Section {
  id: string;
  title: string;
  status?: Status;
}

const pageTitle = defineMessage({
  defaultMessage: "Account settings",
  id: "2r9tuE",
  description: "Title for the account settings page",
});

const subTitle = defineMessage({
  defaultMessage:
    "Update your personal and employee information, manage notifications, and update your availability.",
  id: "SdglrJ",
  description: "Subtitle for the account settings page.",
});

interface AccountSettingsProps {
  personalInfoQuery: FragmentType<typeof PersonalInformation_Fragment>;
}

const AccountSettings = ({ personalInfoQuery }: AccountSettingsProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const personalInfo = getFragment(
    PersonalInformation_Fragment,
    personalInfoQuery,
  );

  const enabledEmailNotifications = unpackMaybes(
    personalInfo.enabledEmailNotifications,
  );
  const enabledInAppNotifications = unpackMaybes(
    personalInfo.enabledInAppNotifications,
  );

  const formattedPageTitle = intl.formatMessage(pageTitle);
  const formattedSubTitle = intl.formatMessage(subTitle);

  const sections: Record<SectionKey, Section> = {
    accountAndContact: {
      id: "account-and-contact",
      title: intl.formatMessage({
        defaultMessage: "Account and contact information",
        id: "sx79Vq",
        description:
          "Title for the account and contact information information section",
      }),
    },
    notificationSettings: {
      id: "notification-settings",
      title: intl.formatMessage({
        defaultMessage: "Notification settings",
        id: "mZ1C/0",
        description: "Title for the notification settings.",
      }),
    },
    accountManagement: {
      id: "account-management",
      title: intl.formatMessage({
        defaultMessage: "Account management",
        id: "efBMD2",
        description: "Title for the account management.",
      }),
    },
  };

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: paths.accountSettings(),
      },
    ],
  });

  const manageAccountUri = getRuntimeVariable("OAUTH_MANAGE_ACCOUNT_URI");

  return (
    <>
      <SEO title={formattedPageTitle} description={formattedSubTitle} />
      <Hero
        title={formattedPageTitle}
        subtitle={formattedSubTitle}
        crumbs={crumbs}
      />
      <Container className="my-18">
        <TableOfContents.Wrapper>
          <TableOfContents.Navigation>
            <TableOfContents.List>
              {Object.values(sections).map((section) => {
                if (section.status) {
                  return (
                    <TableOfContents.ListItem key={section.id}>
                      <StatusItem
                        asListItem={false}
                        title={section.title}
                        status={section.status}
                        scrollTo={section.id}
                      />
                    </TableOfContents.ListItem>
                  );
                }
                return (
                  <TableOfContents.ListItem key={section.id}>
                    <TableOfContents.AnchorLink id={section.id}>
                      {section.title}
                    </TableOfContents.AnchorLink>
                  </TableOfContents.ListItem>
                );
              })}
            </TableOfContents.List>
            <Separator space="sm" />
            <div className="flex flex-col gap-y-3">
              <Link href={paths.profile()}>
                {intl.formatMessage(navigationMessages.applicantProfile)}
              </Link>
              <Link href={paths.employeeProfile()}>
                {intl.formatMessage(navigationMessages.employeeProfileGC)}
              </Link>
            </div>
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <TableOfContents.Section id={sections.accountAndContact.id}>
              <Card space="lg">
                <TableOfContents.Heading
                  size="h3"
                  icon={UserCircleIcon}
                  color="primary"
                  className="mt-0 mb-6"
                >
                  {sections.accountAndContact.title}
                </TableOfContents.Heading>
                <div className="mb-6">
                  {intl.formatMessage(
                    {
                      defaultMessage:
                        "GC Digital Talent partners with the Government of Canada’s credential service, CanadaLogin, to provide you with account access using a single username and password. You can <a>manage related data on the CanadaLogin website</a> and it will automatically reflect here when you access your account.",
                      id: "zLaAer",
                      description:
                        "Description for the account and information section",
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
                        <Link
                          href={`mailto:${personalInfo.email}`}
                          color="black"
                        >
                          {personalInfo.email}
                        </Link>
                      </p>
                    ) : null}

                    {personalInfo.telephone ? (
                      <p>{personalInfo.telephone}</p>
                    ) : null}
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
                    <CardSeparator
                      space="lg"
                      orientation="horizontal"
                      className="my-0"
                    />
                    <div className="mt-6">
                      <Link
                        href={manageAccountUri}
                        external
                        className="font-bold"
                      >
                        {intl.formatMessage({
                          defaultMessage: "Update CanadaLogin information",
                          id: "vdPlPP",
                          description:
                            "Link to update your CanadaLogin information",
                        })}
                      </Link>
                    </div>
                  </>
                ) : null}
              </Card>
            </TableOfContents.Section>
            <TableOfContents.Section
              id={sections.notificationSettings.id}
              className="mt-12 xs:mt-18"
            >
              <TableOfContents.Heading
                size="h3"
                icon={Cog8ToothIcon}
                color="secondary"
                className="mt-0 mb-6"
              >
                {sections.notificationSettings.title}
              </TableOfContents.Heading>
              <p className="mb-6">
                {intl.formatMessage({
                  defaultMessage:
                    "The settings provided in this section allow you to control the types of notifications you receive and where they are delivered. Email notifications are delivered to the contact email provided on your profile, while in-app notifications are delivered to the notification pane found in the main menu.",
                  id: "J/gp3y",
                  description:
                    "Subtitle for notification settings section on account settings page.",
                })}
              </p>
              <NotificationSettings
                enabledEmailNotifications={enabledEmailNotifications}
                enabledInAppNotifications={enabledInAppNotifications}
              />
            </TableOfContents.Section>
            <TableOfContents.Section
              id={sections.accountManagement.id}
              className="mt-12 xs:mt-18"
            >
              <TableOfContents.Heading
                size="h3"
                icon={Cog8ToothIcon}
                color="primary"
                className="mt-0 mb-6"
              >
                {sections.accountManagement.title}
              </TableOfContents.Heading>
              <p className="mb-6">
                {intl.formatMessage({
                  defaultMessage:
                    "This section focuses on general account management and information related to how we link to your GCKey.",
                  id: "G6PxDn",
                  description:
                    "Subtitle for account management section on account settings page.",
                })}
              </p>
              <AccountManagement />
            </TableOfContents.Section>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </Container>
    </>
  );
};

const AccountSettings_Query = graphql(/* GraphQL */ `
  query AccountSettings {
    me {
      ...PersonalInformation
    }
  }
`);

export const AccountSettingsPage = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: AccountSettings_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <AccountSettings personalInfoQuery={data?.me} />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>{intl.formatMessage(messages.userNotFound)}</p>
        </NotFound>
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <AccountSettingsPage />
  </RequireAuth>
);

Component.displayName = "AccountSettingsPage";

export default Component;
