import React from "react";
import { useIntl } from "react-intl";
import { UserIcon } from "@heroicons/react/24/outline";

import SEO from "~/components/SEO/SEO";
import PageHeader from "~/components/PageHeader";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";

import UserTable from "./components/UserTable";

export const IndexUserPage: React.FC = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Users",
    id: "Kr9mHX",
    description: "Page title for the user index page",
  });

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "DUK/pz",
        description: "Breadcrumb title for the home page link.",
      }),
      url: routes.admin(),
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Users",
        id: "Y7eGtg",
        description: "Breadcrumb title for the users page link.",
      }),
      url: routes.userTable(),
    },
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <SEO title={pageTitle} />
      <PageHeader icon={UserIcon}>{pageTitle}</PageHeader>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "The following is a list of active users along with some of their details.",
          id: "UvKDXK",
          description:
            "Descriptive text about the list of users in the admin portal.",
        })}
      </p>
      <UserTable />
    </AdminContentWrapper>
  );
};

export default IndexUserPage;
