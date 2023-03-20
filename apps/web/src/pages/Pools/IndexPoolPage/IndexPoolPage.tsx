import React from "react";
import { useIntl } from "react-intl";
import { Squares2X2Icon } from "@heroicons/react/24/outline";

import useRoutes from "~/hooks/useRoutes";
import PageHeader from "~/components/PageHeader";
import SEO from "~/components/SEO/SEO";

import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import PoolTableApi from "./components/PoolTable";

export const PoolPage: React.FC = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Pools",
    id: "SnytBx",
    description: "Page title for the pools index page",
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
        defaultMessage: "Pools",
        id: "3fAkvM",
        description: "Breadcrumb title for the pools page link.",
      }),
      url: routes.poolTable(),
    },
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <SEO title={pageTitle} />
      <PageHeader icon={Squares2X2Icon}>{pageTitle}</PageHeader>
      <PoolTableApi />
    </AdminContentWrapper>
  );
};

export default PoolPage;
