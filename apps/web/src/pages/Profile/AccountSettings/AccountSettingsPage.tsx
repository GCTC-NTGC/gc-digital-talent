import { useIntl, defineMessage } from "react-intl";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";
import { useQuery } from "urql";
import { ReactNode } from "react";

import {
  Container,
  Pending,
  TableOfContents,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import profileMessages from "~/messages/profileMessages";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import AccountManagement from "./AccountManagement";
import NotificationSettings from "./NotificationSettings";

const AccountSettings_Query = graphql(/* GraphQL */ `
  query AccountSettings {
    me {
      id
      enabledEmailNotifications
      enabledInAppNotifications
    }
  }
`);

export type SectionKey = "accountManagement" | "notificationSettings";

interface Section {
  id: string;
  title: ReactNode;
}

const pageTitle = defineMessage({
  defaultMessage: "Account settings",
  id: "2r9tuE",
  description: "Title for the account settings page",
});

const subTitle = defineMessage({
  defaultMessage: "Learn about GCKey and manage your notifications.",
  id: "HR2ouB",
  description: "Subtitle for the account settings page.",
});

const AccountSettingsPage = () => {
  const intl = useIntl();
  const paths = useRoutes();

  const [{ data, fetching, error }] = useQuery({
    query: AccountSettings_Query,
  });

  const enabledEmailNotifications = unpackMaybes(
    data?.me?.enabledEmailNotifications,
  );
  const enabledInAppNotifications = unpackMaybes(
    data?.me?.enabledInAppNotifications,
  );

  const formattedPageTitle = intl.formatMessage(pageTitle);
  const formattedSubTitle = intl.formatMessage(subTitle);

  const sections: Record<SectionKey, Section> = {
    accountManagement: {
      id: "account-management",
      title: intl.formatMessage({
        defaultMessage: "Account management",
        id: "efBMD2",
        description: "Title for the account management.",
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
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
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
                    return (
                      <TableOfContents.ListItem key={section.id}>
                        <TableOfContents.AnchorLink id={section.id}>
                          {section.title}
                        </TableOfContents.AnchorLink>
                      </TableOfContents.ListItem>
                    );
                  })}
                </TableOfContents.List>
              </TableOfContents.Navigation>
              <TableOfContents.Content>
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
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
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

export default AccountSettingsPage;
