import * as React from "react";
import { useIntl } from "react-intl";
import { UserIcon } from "@heroicons/react/24/outline";

import PageHeader from "~/components/PageHeader";
import SEO from "~/components/SEO/SEO";

const ViewUserPage = () => {
  const intl = useIntl();

  const pageTitle = intl.formatMessage({
    defaultMessage: "User profile",
    id: "BkH0qC",
    description: "Page title for the view user profile page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <PageHeader icon={UserIcon}>{pageTitle}</PageHeader>
    </>
  );
};

export default ViewUserPage;
