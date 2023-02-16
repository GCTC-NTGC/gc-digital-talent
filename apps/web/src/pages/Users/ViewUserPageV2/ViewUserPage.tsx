import * as React from "react";
import { useIntl } from "react-intl";

import SEO from "@common/components/SEO/SEO";

const ViewUserPage = () => {
  const intl = useIntl();

  const pageTitle = intl.formatMessage({
    defaultMessage: "User profile",
    id: "BkH0qC",
    description: "Page title for the view user profile page",
  });

  return <SEO title={pageTitle} />;
};

export default ViewUserPage;
