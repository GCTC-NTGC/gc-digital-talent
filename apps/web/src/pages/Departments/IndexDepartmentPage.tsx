import React from "react";
import { useIntl } from "react-intl";

import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";
import adminMessages from "~/messages/adminMessages";
import AdminHero from "~/components/Hero/AdminHero";

import DepartmentTableApi from "./components/DepartmentTable";

export const DepartmentPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const pageTitle = intl.formatMessage(adminMessages.departments);

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
      label: intl.formatMessage(adminMessages.departments),
      url: routes.departmentTable(),
    },
  ];

  return (
    <>
      <SEO title={pageTitle} />
      <AdminHero
        title={pageTitle}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        <DepartmentTableApi title={pageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export default DepartmentPage;
