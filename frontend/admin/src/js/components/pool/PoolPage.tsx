import React from "react";
import { useIntl } from "react-intl";
import { Squares2X2Icon } from "@heroicons/react/24/outline";

import PageHeader from "@common/components/PageHeader";
import SEO from "@common/components/SEO/SEO";

import DashboardContentContainer from "../DashboardContentContainer";
import { PoolTableApi } from "./PoolTable";

export const PoolPage: React.FC = () => {
  const intl = useIntl();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Pools",
    id: "SnytBx",
    description: "Page title for the pools index page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <DashboardContentContainer>
        <PageHeader icon={Squares2X2Icon}>{pageTitle}</PageHeader>
        <PoolTableApi />
      </DashboardContentContainer>
    </>
  );
};

export default PoolPage;
