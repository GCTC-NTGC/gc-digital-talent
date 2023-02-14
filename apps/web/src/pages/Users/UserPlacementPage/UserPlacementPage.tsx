import * as React from "react";
import { useIntl } from "react-intl";
import { UserIcon } from "@heroicons/react/24/outline";

import PageHeader from "~/components/PageHeader";
import SEO from "~/components/SEO/SEO";

const UserPlacementPage = () => {
  const intl = useIntl();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Placement information",
    id: "/WvEvL",
    description: "Page title for the user placement information page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <PageHeader icon={UserIcon}>{pageTitle}</PageHeader>
    </>
  );
};

export default UserPlacementPage;
