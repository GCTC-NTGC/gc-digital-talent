import React from "react";
import { useIntl } from "react-intl";

export interface LoadingProps {
  inline?: boolean;
  /**
   * polite: wait for idle state (recommended)
   * assertive: interrupt the current user workflow
   *
   * REF: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
   */
  live?: "polite" | "assertive";
}

const Loading: React.FC<LoadingProps> = ({ inline, live }) => {
  const intl = useIntl();

  return (
    <div
      {...{
        "data-h2-position": inline ? "b(relative)" : "b(fixed)",
      }}
      {...(live && {
        "aria-live": live,
      })}
      data-h2-display="b(flex)"
      data-h2-align-items="b(center)"
      data-h2-justify-content="b(center)"
      style={{
        backgroundColor: `rgba(255,255,255,0.9)`,
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
