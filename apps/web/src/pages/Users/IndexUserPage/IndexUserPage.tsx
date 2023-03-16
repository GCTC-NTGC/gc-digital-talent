import React from "react";
import { useIntl } from "react-intl";
import { UserIcon } from "@heroicons/react/24/outline";

import SEO from "~/components/SEO/SEO";
import PageHeader from "~/components/PageHeader";

import UserTable from "./components/UserTable";

export const IndexUserPage: React.FC = () => {
  const intl = useIntl();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Users",
    id: "Kr9mHX",
    description: "Page title for the user index page",
  });

  return (
    <>
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
    </>
  );
};

export default IndexUserPage;
