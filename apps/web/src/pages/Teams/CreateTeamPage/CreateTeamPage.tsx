import * as React from "react";
import { useIntl } from "react-intl";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";

import PageHeader from "~/components/PageHeader";
import SEO from "~/components/SEO/SEO";

const CreateTeamPage = () => {
  const intl = useIntl();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Create a new team",
    id: "vyyfX6",
    description: "Page title for the create team page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <PageHeader icon={BuildingOffice2Icon}>{pageTitle}</PageHeader>
    </>
  );
};

export default CreateTeamPage;
