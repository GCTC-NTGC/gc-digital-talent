import React from "react";
import BellAlertIcon from "@heroicons/react/24/outline/BellAlertIcon";
import { defineMessage, defineMessages, useIntl } from "react-intl";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";

import { graphql } from "@gc-digital-talent/graphql";
import { CardBasic, Heading, Link, Sidebar } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero/Hero";
import useRoutes from "~/hooks/useRoutes";

import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

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

// TO DO: Uncomment when real notifications exist
// const Notifications_Query = graphql(/* GraphQL */ `
//  query Notifications(
//    $where: NotificationFilterInput
//    $first: Int
//    $page: Int
//  ) {
//    notifications(where: $where, first: $first, page: $page) {
//      data {
//        id
//      }
//    }
//  }
// `);

const NotificationsPage = () => {
  const intl = useIntl();
  const paths = useRoutes();

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
            </Sidebar.Content>
          </Sidebar.Wrapper>
        </div>
      </section>
    </>
  );
};

export default NotificationsPage;
