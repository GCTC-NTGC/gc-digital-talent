import React from "react";
import { useIntl } from "react-intl";

const Spinner: React.FC = () => {
  const intl = useIntl();
  return (
    <span className="lds-dual-ring">
      <span data-h2-visually-hidden="base(invisible)">
        {intl.formatMessage({
          defaultMessage: "Searching...",
          id: "w6vHXf",
          description: "Message to display when a search is in progress.",
        })}
      </span>
    </span>
  );
};

export default Spinner;
