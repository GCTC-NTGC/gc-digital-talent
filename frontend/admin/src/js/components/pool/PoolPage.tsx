import React from "react";
import { useIntl } from "react-intl";
import { Squares2X2Icon } from "@heroicons/react/24/outline";

import PageHeader from "@common/components/PageHeader";

import DashboardContentContainer from "../DashboardContentContainer";
import { PoolTableApi } from "./PoolTable";

export const PoolPage: React.FC = () => {
  const intl = useIntl();
  return (
    <DashboardContentContainer>
      <PageHeader icon={Squares2X2Icon}>
        {intl.formatMessage({
          defaultMessage: "Pools",
          id: "qL43Gw",
          description: "Heading displayed above the Pool Table component.",
        })}
      </PageHeader>

      <PoolTableApi />
    </DashboardContentContainer>
  );
};

export default PoolPage;
