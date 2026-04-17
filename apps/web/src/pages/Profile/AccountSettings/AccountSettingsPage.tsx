import { useIntl, defineMessage } from "react-intl";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";
import { useQuery } from "urql";

import {
  Container,
  Link,
  NotFound,
  Pending,
  Separator,
  TableOfContents,
} from "@gc-digital-talent/ui";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";

import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import type { Status } from "~/components/StatusItem/StatusItem";
import StatusItem from "~/components/StatusItem/StatusItem";
import messages from "~/messages/profileMessages";

import NotificationSettings from "./NotificationSettings";
import AccountAndContactInformation from "./AccountAndContactInformation";

export const PersonalInformation_Fragment = graphql(/** GraphQL */ `
  fragment PersonalInformation on User {
    id
    enabledEmailNotifications
    enabledInAppNotifications
    ...AccountAndContactInformation
  }
`);

export type SectionKey = "accountAndContact" | "notificationSettings";

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

export const AccountSettings = ({
  personalInfoQuery,
}: AccountSettingsProps) => {
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
  };

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: paths.accountSettings(),
      },
    ],
  });

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
              <AccountAndContactInformation query={personalInfo} />
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
