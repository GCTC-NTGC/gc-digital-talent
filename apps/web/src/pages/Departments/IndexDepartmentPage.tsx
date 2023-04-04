import React from "react";
import { useIntl } from "react-intl";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";

import PageHeader from "~/components/PageHeader";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";

import DepartmentTableApi from "./components/DepartmentTable";

export const DepartmentPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const pageTitle = intl.formatMessage({
    defaultMessage: "Departments",
    id: "457hEW",
    description: "Heading displayed above the Department Table component.",
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
        defaultMessage: "Departments",
        id: "Ig9HmP",
        description: "Breadcrumb title for the departments page link.",
      }),
      url: routes.departmentTable(),
    },
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <SEO title={pageTitle} />
      <PageHeader icon={BuildingOfficeIcon}>{pageTitle}</PageHeader>
      <DepartmentTableApi />
    </AdminContentWrapper>
  );
};

export default DepartmentPage;
