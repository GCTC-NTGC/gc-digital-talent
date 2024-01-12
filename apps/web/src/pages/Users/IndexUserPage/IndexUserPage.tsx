import React from "react";
import { MessageDescriptor, defineMessage, useIntl } from "react-intl";
import UserCircleOutlineIcon from "@heroicons/react/24/outline/UserCircleIcon";
import UserCircleSolidIcon from "@heroicons/react/24/solid/UserCircleIcon";

import { IconType } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";
import AdminHero from "~/components/Hero/AdminHero";

import UserTable from "./components/UserTable";

export const pageTitle: MessageDescriptor = defineMessage({
  defaultMessage: "All users",
  id: "bVQ/rm",
  description: "Title for the index user page",
});
export const pageOutlineIcon: IconType = UserCircleOutlineIcon;
export const pageSolidIcon: IconType = UserCircleSolidIcon;

export const IndexUserPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitle);

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: routes.adminDashboard(),
    },
    {
      label: formattedPageTitle,
      url: routes.userTable(),
    },
  ];

  return (
    <>
      <SEO title={formattedPageTitle} />
      <AdminHero
        title={formattedPageTitle}
        subtitle={intl.formatMessage({
          defaultMessage:
            "The following is a list of active users along with some of their details.",
          id: "UvKDXK",
          description:
            "Descriptive text about the list of users in the admin portal.",
        })}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        <UserTable title={formattedPageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export default IndexUserPage;
