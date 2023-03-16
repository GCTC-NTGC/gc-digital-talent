import React from "react";
import { useIntl } from "react-intl";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";

import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import PageHeader from "~/components/PageHeader/PageHeader";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";

import TeamTableApi from "./components/TeamTable/TeamTable";

const IndexTeamPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Teams",
    id: "lOiNyG",
    description: "Page title for the teams index page",
  });

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
      label: intl.formatMessage({
        defaultMessage: "Teams",
        id: "P+KWP7",
        description: "Breadcrumb title for the teams page link.",
      }),
      url: routes.teamTable(),
    },
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
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
    </AdminContentWrapper>
  );
};

export default IndexTeamPage;
