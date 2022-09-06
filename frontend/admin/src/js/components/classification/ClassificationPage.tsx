import React from "react";
import { useIntl } from "react-intl";
import { TagIcon } from "@heroicons/react/outline";

import PageHeader from "@common/components/PageHeader";

import { ClassificationTableApi } from "./ClassificationTable";
import DashboardContentContainer from "../DashboardContentContainer";

export const ClassificationPage: React.FC = () => {
  const intl = useIntl();

  return (
    <DashboardContentContainer>
      <PageHeader icon={TagIcon}>
        {intl.formatMessage({
          defaultMessage: "Classifications",
          description:
            "Heading displayed above the Classification Table component.",
        })}
      </PageHeader>
      <ClassificationTableApi />
    </DashboardContentContainer>
  );
};

export default ClassificationPage;
