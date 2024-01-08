import React from "react";
import { useIntl } from "react-intl";

import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";
import AdminHero from "~/components/Hero/AdminHero";

import DepartmentTableApi from "./components/DepartmentTable";
import { indexDepartmentPageTitle as pageTitle } from "./navigation";

export const DepartmentPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const formattedPageTitle = intl.formatMessage(pageTitle);

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
      label: formattedPageTitle,
      url: routes.departmentTable(),
    },
  ];

  return (
    <>
      <SEO title={formattedPageTitle} />
      <AdminHero
        title={formattedPageTitle}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        <DepartmentTableApi title={formattedPageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export default DepartmentPage;
