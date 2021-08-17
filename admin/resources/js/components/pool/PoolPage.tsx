import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { Link } from "../../helpers/router";

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
      <span>Add Pools Table Here</span>
    </div>
  );
};

export default PoolPage;
