import React from "react";
import { useIntl } from "react-intl";
import BuildingOfficeIcon from "@heroicons/react/24/outline/BuildingOfficeIcon";

import PageHeader from "~/components/PageHeader";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";

import adminMessages from "~/messages/adminMessages";
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
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <SEO title={pageTitle} />
      <PageHeader icon={BuildingOfficeIcon}>{pageTitle}</PageHeader>
      <DepartmentTableApi title={pageTitle} />
    </AdminContentWrapper>
  );
};

export default DepartmentPage;
