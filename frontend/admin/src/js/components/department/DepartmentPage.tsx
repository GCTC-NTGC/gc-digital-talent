import React from "react";
import { useIntl } from "react-intl";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";

import PageHeader from "@common/components/PageHeader";

import { DepartmentTableApi } from "./DepartmentTable";
import DashboardContentContainer from "../DashboardContentContainer";

export const DepartmentPage: React.FC = () => {
  const intl = useIntl();
  return (
    <DashboardContentContainer>
      <PageHeader icon={BuildingOfficeIcon}>
        {intl.formatMessage({
          defaultMessage: "Departments",
          id: "457hEW",
          description:
            "Heading displayed above the Department Table component.",
        })}
      </PageHeader>
      <DepartmentTableApi />
    </DashboardContentContainer>
  );
};

export default DepartmentPage;
