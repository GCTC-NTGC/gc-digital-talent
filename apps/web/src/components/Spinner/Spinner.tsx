import React from "react";
import { useIntl } from "react-intl";

import { Loading } from "@gc-digital-talent/ui";

const Spinner = () => {
  const intl = useIntl();
  return (
    <Loading inline>
      {intl.formatMessage({
        defaultMessage: "Searching...",
        id: "w6vHXf",
        description: "Message to display when a search is in progress.",
      })}
    </Loading>
  );
};

export default Spinner;
