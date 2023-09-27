import React from "react";
import { useIntl } from "react-intl";

const OpenQuote = (props: React.HTMLAttributes<HTMLOrSVGElement>) => {
  const intl = useIntl();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 78 62"
      {...props}
    >
      <title>
        {intl.formatMessage({
          defaultMessage: "open quote mark",
          id: "BYhh2I",
          description: "Indigenous Apprenticeship open quote text alternative",
        })}
      </title>
      <path
        fill="#fff"
        fillOpacity="0.5"
        d="M15.392.4h16.416L21.44 31.216h10.08v30.528H.416V34.096L15.392.4zm46.08 0h16.416L67.52 31.216H77.6v30.528H46.496V34.096L61.472.4z"
      />
    </svg>
  );
};

export default OpenQuote;
