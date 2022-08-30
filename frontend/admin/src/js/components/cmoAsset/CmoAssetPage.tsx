import React from "react";
import { useIntl } from "react-intl";
import { PaperClipIcon } from "@heroicons/react/outline";

import PageHeader from "@common/components/PageHeader";

import { CmoAssetTableApi } from "./CmoAssetTable";
import DashboardContentContainer from "../DashboardContentContainer";

export const CmoAssetPage: React.FC = () => {
  const intl = useIntl();

  return (
    <DashboardContentContainer>
      <PageHeader icon={PaperClipIcon}>
        {intl.formatMessage({
          defaultMessage: "CMO Assets",
          description: "Heading displayed above the CMO Asset Table component.",
        })}
      </PageHeader>
      <CmoAssetTableApi />
    </DashboardContentContainer>
  );
};

export default CmoAssetPage;
