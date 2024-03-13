import React from "react";
import BellAlertIcon from "@heroicons/react/24/outline/BellAlertIcon";
import { defineMessages, useIntl } from "react-intl";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";
import { useQuery } from "urql";
import { useSearchParams } from "react-router-dom";

import { graphql } from "@gc-digital-talent/graphql";
import {
  CardBasic,
  Heading,
  Link,
  Pending,
  Sidebar,
  Well,
} from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero/Hero";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import NotificationList from "~/components/NotificationList/NotificationList";

const meta = defineMessages({
  title: {
    defaultMessage: "Notifications",
    id: "hbcdJm",
    description: "Page title for the notifications page",
  },
  description: {
    defaultMessage: "View and manage your notification history.",
    id: "6ft0/o",
    description: "Subtitle for the notifications page",
  },
});

const Notifications_Query = graphql(/* GraphQL */ `
  query Notifications(
    $where: NotificationFilterInput
    $first: Int
    $page: Int
  ) {
    notifications(where: $where, first: $first, page: $page) {
      data {
        id
        ...NotificationItem
      }
    }
  }
`);

const NotificationsPage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const [searchParams] = useSearchParams();
  const onlyUnread =
    searchParams.has("unread") && searchParams.get("unread") !== null;
  const [{ data, fetching, error }] = useQuery({
    query: Notifications_Query,
    variables: {
      where: {
        onlyUnread,
      },
    },
  });

  const notifications = unpackMaybes(data?.notifications.data);

  const breadcrumbs = useBreadcrumbs([
    {
      label: intl.formatMessage(meta.title),
      url: paths.notifications(),
    },
  ]);

  return (
    <>
      <SEO
        title={intl.formatMessage(meta.title)}
        description={intl.formatMessage(meta.description)}
      />
      <Hero
        title={intl.formatMessage(meta.title)}
        subtitle={intl.formatMessage(meta.description)}
        crumbs={breadcrumbs}
      />

      <section data-h2-margin="base(x3, 0)">
        <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
          <Sidebar.Wrapper>
            <Sidebar.Sidebar>
              <CardBasic>
                <Heading level="h2" size="h6" data-h2-margin-top="base(0)">
                  {intl.formatMessage({
                    defaultMessage: "Notification settings",
                    id: "5H61KV",
                    description: "Title for managing notification settings",
                  })}
                </Heading>
                <p data-h2-margin="base(x.5 0)">
                  {intl.formatMessage({
                    defaultMessage:
                      "You can manage the types of notifications along with how they are delivered to you on your account settings page.",
                    id: "Af4zOR",
                    description:
                      "Describing where to go to manage notification settings",
                  })}
                </p>
                <p>
                  {/** Update URL when page is created in (ticket not created yet?) */}
                  <Link
                    href={paths.home()}
                    icon={Cog8ToothIcon}
                    mode="inline"
                    color="primary"
                  >
                    {intl.formatMessage({
                      defaultMessage: "Update settings",
                      id: "uzqiPj",
                      description: "Link text for the account settings page",
                    })}
                  </Link>
                </p>
              </CardBasic>
            </Sidebar.Sidebar>
            <Sidebar.Content>
              <Heading
                level="h2"
                Icon={BellAlertIcon}
                color="primary"
                data-h2-font-weight="base(400)"
                data-h2-margin-top="base(0)"
              >
                {intl.formatMessage({
                  defaultMessage: "Notification history",
                  id: "ipDTrs",
                  description: "Title for list of a users notifications",
                })}
              </Heading>
              <p data-h2-margin="base(x1 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "This page provides a complete overview of your notification history. From here you can review, pin, and delete notifications from your account. If you'd like to manage which notifications you receive and their format, you can do so from your account settings page.",
                  id: "vW/JGo",
                  description:
                    "Description of the list of a users notifications",
                })}
              </p>
              <Pending inline fetching={fetching} error={error}>
                {notifications.length > 0 ? (
                  <NotificationList.Root onlyUnread={onlyUnread}>
                    {notifications.map((notification) => (
                      <NotificationList.Item
                        key={notification.id}
                        notification={notification}
                      />
                    ))}
                  </NotificationList.Root>
                ) : (
                  <Well>
                    <p
                      data-h2-font-weight="base(700)"
                      data-h2-margin-bottom="base(x1)"
                    >
                      {intl.formatMessage({
                        defaultMessage:
                          "There aren't any notification here yet.",
                        id: "5BRZs6",
                        description: "Title for the no notifications message",
                      })}
                    </p>
                    <p>
                      {intl.formatMessage({
                        defaultMessage:
                          "As you receive notifications, they'll appear here and automatically be categorized on whether you've actioned or pinned them.",
                        id: "91KsMq",
                        description:
                          "Explanation of how the list of notifications work",
                      })}
                    </p>
                  </Well>
                )}
              </Pending>
            </Sidebar.Content>
          </Sidebar.Wrapper>
        </div>
      </section>
    </>
  );
};

export default NotificationsPage;
