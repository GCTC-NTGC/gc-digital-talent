import React from "react";
import { useIntl } from "react-intl";
import { OfficeBuildingIcon } from "@heroicons/react/outline";

import PageHeader from "@common/components/PageHeader";

import { DepartmentTableApi } from "./DepartmentTable";
import DashboardContentContainer from "../DashboardContentContainer";

export const DepartmentPage: React.FC = () => {
  const intl = useIntl();
  return (
    <DashboardContentContainer>
      <PageHeader icon={OfficeBuildingIcon}>
        {intl.formatMessage({
          defaultMessage: "Departments",
          description:
            "Heading displayed above the Department Table component.",
        })}
      </PageHeader>
      <DepartmentTableApi />
    </DashboardContentContainer>
  );
};

export default DepartmentPage;
