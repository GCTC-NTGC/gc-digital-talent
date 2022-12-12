import React from "react";
import { useIntl } from "react-intl";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";

import PageHeader from "@common/components/PageHeader";
import SEO from "@common/components/SEO/SEO";

import { DepartmentTableApi } from "./DepartmentTable";
import DashboardContentContainer from "../DashboardContentContainer";

export const DepartmentPage: React.FC = () => {
  const intl = useIntl();
  const pageTitle = intl.formatMessage({
    defaultMessage: "Departments",
    id: "457hEW",
    description: "Heading displayed above the Department Table component.",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <DashboardContentContainer>
        <PageHeader icon={BuildingOfficeIcon}>{pageTitle}</PageHeader>
        <DepartmentTableApi />
      </DashboardContentContainer>
    </>
  );
};

export default DepartmentPage;
