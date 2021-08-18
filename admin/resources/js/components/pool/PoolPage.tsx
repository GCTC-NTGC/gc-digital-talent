import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { Link } from "../../helpers/router";
import { PoolTableApi } from "../PoolTable";

const messages = defineMessages({
  poolCreateHeading: {
    id: "poolPage.poolCreateHeading",
    defaultMessage: "Create Pool",
    description: "Heading displayed above the Pool Table component.",
  },
});

export const PoolPage: React.FC = () => {
  const intl = useIntl();
  return (
    <div>
      <Link href="/pools/create" title="">
        {intl.formatMessage(messages.poolCreateHeading)}
      </Link>
      <PoolTableApi />
    </div>
  );
};

export default PoolPage;
