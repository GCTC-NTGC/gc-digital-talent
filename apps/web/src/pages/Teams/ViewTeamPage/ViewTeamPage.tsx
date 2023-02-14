import * as React from "react";
import { useIntl } from "react-intl";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";

import PageHeader from "~/components/PageHeader";
import SEO from "~/components/SEO/SEO";

const ViewTeamPage = () => {
  const intl = useIntl();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Team information",
    id: "SXoCma",
    description: "Page title for the view team page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <PageHeader icon={BuildingOffice2Icon}>{pageTitle}</PageHeader>
    </>
  );
};

export default ViewTeamPage;
