import { useIntl, defineMessage } from "react-intl";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";
import { useMutation, useQuery } from "urql";

import {
  Container,
  NotFound,
  Pending,
  TableOfContents,
} from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { commonMessages } from "@gc-digital-talent/i18n";

import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import PersonalInformation from "~/components/Profile/components/PersonalInformation/PersonalInformation";
import { SectionProps } from "~/components/Profile/types";
import StatusItem, { Status } from "~/components/StatusItem/StatusItem";
import { aboutSectionHasEmptyRequiredFields } from "~/validators/profile";
import messages from "~/messages/profileMessages";
import ContactEmailCard from "~/components/ContactEmailCard/ContactEmailCard";
import WorkEmailCard from "~/components/WorkEmailCard.tsx/WorkEmailCard";

import AccountManagement from "./AccountManagement";
import NotificationSettings from "./NotificationSettings";

const PersonalInformation_Fragment = graphql(/** GraphQL */ `
  fragment PersonalInformation on User {
    id
    firstName
    lastName
    telephone
    email
    isEmailVerified
    workEmail
    isWorkEmailVerified
    preferredLang {
      value
    }
    preferredLanguageForInterview {
      value
    }
    preferredLanguageForExam {
      value
    }
    citizenship {
      value
    }
    armedForcesStatus {
      value
    }
    enabledEmailNotifications
    enabledInAppNotifications
    ...ProfilePersonalInformation
    ...ContactEmailCard
    ...WorkEmailCard
  }
`);

const ProfileUpdateUser_Mutation = graphql(/* GraphQL */ `
  mutation UpdateUserAsUser($id: ID!, $user: UpdateUserAsUserInput!) {
    updateUserAsUser(id: $id, user: $user) {
      id
    }
  }
`);

export type SectionKey =
  | "personalInfo"
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
  defaultMessage: "Learn about GCKey and manage your notifications.",
  id: "HR2ouB",
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
    personalInfo: {
      id: "personal-info",
      title: intl.formatMessage({
        defaultMessage: "Personal and contact information",
        id: "BWh6S1",
        description: "Title for the personal and contact information section",
      }),
      status: aboutSectionHasEmptyRequiredFields(personalInfo)
        ? "error"
        : "success",
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

  const [{ fetching: isUpdating }, executeUpdateMutation] = useMutation(
    ProfileUpdateUser_Mutation,
  );

  const handleUpdate: SectionProps["onUpdate"] = async (userId, userData) => {
    return executeUpdateMutation({
      id: userId,
      user: userData,
    }).then((res) => res.data?.updateUserAsUser);
  };

  const sectionProps = {
    query: personalInfo,
    isUpdating,
    onUpdate: handleUpdate,
    pool: null,
  };

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
                    <TableOfContents.ListItem
                      key={section.id}
                      className="-ml-7px list-none"
                    >
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
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <TableOfContents.Section id={sections.personalInfo.id}>
              <div className="grid grid-cols-1 gap-1.5 xs:grid-cols-2">
                <div className="col-span-2">
                  <PersonalInformation {...sectionProps} />
                </div>
                <ContactEmailCard query={personalInfo} />
                <WorkEmailCard query={personalInfo} />
              </div>
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
