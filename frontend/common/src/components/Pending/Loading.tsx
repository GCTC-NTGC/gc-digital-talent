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

  const typeMap = {
    inline: {
      "data-h2-padding": "b(all, s)",
      "data-h2-position": "b(relative)",
    },
    full: {
      "data-h2-padding": undefined,
      "data-h2-position": "b(fixed)",
    },
  };

  return (
    <div
      {...typeMap[inline ? "inline" : "full"]}
      {...(live && {
        "aria-live": live,
      })}
      data-h2-display="b(flex)"
      data-h2-align-items="b(center)"
      data-h2-justify-content="b(center)"
      style={{
        backgroundColor: inline ? undefined : `rgba(255,255,255,0.95)`,
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
