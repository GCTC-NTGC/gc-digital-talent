import React from "react";
import { useIntl } from "react-intl";
import { ViewGridIcon } from "@heroicons/react/outline";

import PageHeader from "@common/components/PageHeader";

import DashboardContentContainer from "../DashboardContentContainer";
import { PoolTableApi } from "./PoolTable";

export const PoolPage: React.FC = () => {
  const intl = useIntl();
  return (
    <DashboardContentContainer>
      <PageHeader icon={ViewGridIcon}>
        {intl.formatMessage({
          defaultMessage: "Pools",
          description: "Heading displayed above the Pool Table component.",
        })}
      </PageHeader>

      <PoolTableApi />
    </DashboardContentContainer>
  );
};

export default PoolPage;
