import React from "react";
import { useIntl } from "react-intl";

export interface LoadingProps {
  inline?: boolean;
  /**
   * Determine if the loading state should
   * be announced to users
   *
   * This should be used sparingly and usually
   * only with the inline={true}
   *
   * polite: wait for idle state (recommended)
   * assertive: interrupt the current user workflow
   *
   * REF: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
   */
  live?: "polite" | "assertive";
}

const Loading = ({ inline = false, live }: LoadingProps): JSX.Element => {
  const intl = useIntl();

  return (
    <div
      {...{
        "data-h2-position": inline ? "base(relative)" : "base(fixed)",
      }}
      {...(live && {
        "aria-live": live,
      })}
      data-h2-background-color="base(dt-white.2)"
      data-h2-display="base(flex)"
      data-h2-align-items="base(center)"
      data-h2-justify-content="base(center)"
      style={{
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        zIndex: 9999,
      }}
    >
      <span className="lds-dual-ring">
        <span data-h2-visibility="base(invisible)">
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
