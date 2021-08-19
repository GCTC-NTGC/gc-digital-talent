import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { Link } from "../../helpers/router";
import { CmoAssetTableApi } from "./CmoAssetTable";

const messages = defineMessages({
  cmoAssetCreateHeading: {
    id: "cmoAssetPage.cmoAssetCreateHeading",
    defaultMessage: "Create CMO Asset",
    description: "Heading displayed above the CMO Asset Table component.",
  },
});

export const CmoAssetPage: React.FC = () => {
  const intl = useIntl();
  return (
    <div>
      <Link href="/cmo-assets/create" title="">
        {intl.formatMessage(messages.cmoAssetCreateHeading)}
      </Link>
      <CmoAssetTableApi />
    </div>
  );
};

export default CmoAssetPage;
