import React from "react";
import { useIntl } from "react-intl";

const Spinner: React.FC = () => {
  const intl = useIntl();
  return (
    <span className="lds-dual-ring">
      <span data-h2-visibility="b(invisible)">
        {intl.formatMessage({
          defaultMessage: "Searching...",
          description: "Message to display when a search is in progress.",
        })}
      </span>
    </span>
  );
};

export default Spinner;
