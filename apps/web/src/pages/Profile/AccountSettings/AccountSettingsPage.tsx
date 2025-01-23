import { useIntl, defineMessage } from "react-intl";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";
import { useQuery } from "urql";
import { ReactNode } from "react";

import {
  Link,
  Pending,
  TableOfContents,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import profileMessages from "~/messages/profileMessages";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import permissionConstants from "~/constants/permissionConstants";

import AccountManagement from "./AccountManagement";
import RecruitmentAvailability from "./RecruitmentAvailability";
import NotificationSettings from "./NotificationSettings";

const AccountSettings_Query = graphql(/* GraphQL */ `
  query AccountSettings {
    me {
      id
      enabledEmailNotifications
      enabledInAppNotifications
      poolCandidates {
        ...RecruitmentAvailabilityCandidate
      }
    }
  }
`);

export type SectionKey =
  | "accountManagement"
  | "notificationSettings"
  | "recruitmentAvailability";

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
  defaultMessage:
    "Learn about GCKey, manage notifications, and update your availability.",
  id: "WwuIcM",
  description: "Subtitle for the account settings page.",
});

const inlineLink = (href: string, chunks: ReactNode) => (
  <Link href={href} color="black">
    {chunks}
  </Link>
);

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
    recruitmentAvailability: {
      id: "recruitment_availability",
      title: intl.formatMessage({
        defaultMessage: "Recruitment availability",
        id: "nKwVX7",
        description: "Title for the recruitment availability.",
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
          <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
            <TableOfContents.Wrapper>
              <TableOfContents.Navigation data-h2-padding-top="base(x3)">
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
                  data-h2-margin-top="base(x2) p-tablet(x3)"
                >
                  <TableOfContents.Heading
                    size="h3"
                    icon={Cog8ToothIcon}
                    color="primary"
                    data-h2-margin="base(0, 0, x1, 0)"
                  >
                    {sections.accountManagement.title}
                  </TableOfContents.Heading>
                  <p data-h2-margin="base(0, 0, x1, 0)">
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
                  data-h2-margin-top="base(x2) p-tablet(x3)"
                >
                  <TableOfContents.Heading
                    size="h3"
                    icon={Cog8ToothIcon}
                    color="secondary"
                    data-h2-margin="base(0, 0, x1, 0)"
                  >
                    {sections.notificationSettings.title}
                  </TableOfContents.Heading>
                  <p data-h2-margin="base(0, 0, x1, 0)">
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
                  id={sections.recruitmentAvailability.id}
                  data-h2-margin-top="base(x2) p-tablet(x3)"
                >
                  <TableOfContents.Heading
                    size="h3"
                    icon={IdentificationIcon}
                    color="tertiary"
                    data-h2-margin="base(0, 0, x1, 0)"
                  >
                    {sections.recruitmentAvailability.title}
                  </TableOfContents.Heading>
                  <p data-h2-margin="base(0, 0, x1, 0)">
                    {intl.formatMessage(
                      {
                        defaultMessage: `When you are admitted into a talent recruitment process, you agree to receive notifications about potential opportunities that meet the criteria of the process. These notifications will only be sent if you've enabled "Job alert" notifications in the "Notification settings" section of this page. You can also disable these notifications on a per process basis using the controls found on the cards provided.
                        `,
                        id: "wYct8d",
                        description:
                          "Subtitle for recruitment availability section on account settings page.",
                      },
                      {
                        link: (chunks: ReactNode) =>
                          inlineLink(paths.profileAndApplications(), chunks),
                      },
                    )}
                  </p>
                  <RecruitmentAvailability
                    candidatesQuery={unpackMaybes(data.me.poolCandidates)}
                  />
                </TableOfContents.Section>
              </TableOfContents.Content>
            </TableOfContents.Wrapper>
          </div>
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
  <RequireAuth roles={permissionConstants.isApplicant}>
    <AccountSettingsPage />
  </RequireAuth>
);

Component.displayName = "AccountSettingsPage";

export default AccountSettingsPage;
