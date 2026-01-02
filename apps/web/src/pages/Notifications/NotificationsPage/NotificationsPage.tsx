import BellAlertIcon from "@heroicons/react/24/outline/BellAlertIcon";
import { useIntl } from "react-intl";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";

import { Card, Container, Heading, Link, Sidebar } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import NotificationList from "~/components/NotificationList/NotificationList";
import notificationMessages from "~/messages/notificationMessages";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

const NotificationsPage = () => {
  const intl = useIntl();
  const paths = useRoutes();

  const breadcrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(notificationMessages.title),
        url: paths.notifications(),
      },
    ],
  });

  return (
    <>
      <SEO
        title={intl.formatMessage(notificationMessages.title)}
        description={intl.formatMessage(notificationMessages.description)}
      />
      <Hero
        title={intl.formatMessage(notificationMessages.title)}
        subtitle={intl.formatMessage(notificationMessages.description)}
        crumbs={breadcrumbs}
      />
      <Container className="my-18">
        <Sidebar.Wrapper>
          <Sidebar.Sidebar>
            <Card>
              <Heading level="h2" size="h6" className="mt-0">
                {intl.formatMessage({
                  defaultMessage: "Notification settings",
                  id: "5H61KV",
                  description: "Title for managing notification settings",
                })}
              </Heading>
              <p className="my-3">
                {intl.formatMessage({
                  defaultMessage:
                    "You can manage the types of notifications along with how they are delivered to you on your account settings page.",
                  id: "Af4zOR",
                  description:
                    "Describing where to go to manage notification settings",
                })}
              </p>
              <p>
                <Link
                  href={`${paths.accountSettings()}#notification-settings`}
                  icon={Cog8ToothIcon}
                  mode="inline"
                  color="secondary"
                >
                  {intl.formatMessage({
                    defaultMessage: "Update settings",
                    id: "uzqiPj",
                    description: "Link text for the account settings page",
                  })}
                </Link>
              </p>
            </Card>
          </Sidebar.Sidebar>
          <Sidebar.Content>
            <Heading
              level="h2"
              icon={BellAlertIcon}
              color="secondary"
              className="mt-0 font-normal"
            >
              {intl.formatMessage({
                defaultMessage: "Notification history",
                id: "ipDTrs",
                description: "Title for list of a users notifications",
              })}
            </Heading>
            <p className="my-6">
              {intl.formatMessage({
                defaultMessage:
                  "This page provides a complete overview of your notification history. From here you can review, pin, and delete notifications from your account. If you'd like to manage which notifications you receive and their format, you can do so from your account settings page.",
                id: "vW/JGo",
                description: "Description of the list of a users notifications",
              })}
            </p>
            <NotificationList paginate />
          </Sidebar.Content>
        </Sidebar.Wrapper>
      </Container>
    </>
  );
};

export const Component = () => {
  return (
    <RequireAuth roles={[ROLE_NAME.Applicant]}>
      <NotificationsPage />
    </RequireAuth>
  );
};

Component.displayName = "NotificationsPage";

export default Component;
