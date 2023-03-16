import React from "react";
import { useIntl } from "react-intl";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";

import SEO from "~/components/SEO/SEO";
import PageHeader from "~/components/PageHeader/PageHeader";

import TeamTableApi from "./components/TeamTable/TeamTable";

const IndexTeamPage = () => {
  const intl = useIntl();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Teams",
    id: "lOiNyG",
    description: "Page title for the teams index page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <PageHeader icon={BuildingOffice2Icon}>{pageTitle}</PageHeader>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "The following is a table of teams along with their details. You can also create a new team or edit existing ones.",
          id: "i4TGiO",
          description:
            "Descriptive text about the list of teams in the admin portal.",
        })}
      </p>
      <TeamTableApi />
    </>
  );
};

export default IndexTeamPage;
