import React from "react";
import { useIntl } from "react-intl";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";

import PageHeader from "@common/components/PageHeader";
import SEO from "@common/components/SEO/SEO";

import DepartmentTableApi from "./components/DepartmentTable";

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
      <PageHeader icon={BuildingOfficeIcon}>{pageTitle}</PageHeader>
      <DepartmentTableApi />
    </>
  );
};

export default DepartmentPage;
