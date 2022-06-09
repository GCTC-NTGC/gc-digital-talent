import React from "react";
import { useIntl } from "react-intl";

export interface LoadingProps {
  inline?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ inline }) => {
  const intl = useIntl();

  return (
    <div
      {...{
        "data-h2-position": inline ? "b(relative)" : "b(fixed)",
      }}
      data-h2-display="b(flex)"
      data-h2-align-items="b(center)"
      data-h2-justify-content="b(center)"
      style={{
        backgroundColor: `rgba(255,255,255,0.8)`,
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        zIndex: 9999,
      }}
    >
      <span className="lds-dual-ring">
        <span data-h2-visibility="b(invisible)">
          {intl.formatMessage({
            defaultMessage: "Loading...",
            description: "Message to display when a page is loading.",
          })}
        </span>
      </span>
    </div>
  );
};

export default Loading;
