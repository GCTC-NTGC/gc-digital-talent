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
  const inlineWrapper = {
    inline: {
      "data-h2-background-color": "base(dt-white)",
      "data-h2-padding": "base(x.25)",
      "data-h2-radius": "base(100%)",
    },
    none: {},
  };
  const typeMap = {
    inline: {
      "data-h2-position": "base(relative)",
    },
    full: {
      "data-h2-position": "base(fixed)",
    },
  };

  return (
    <div
      {...typeMap[inline ? "inline" : "full"]}
      {...(live && {
        "aria-live": live,
      })}
      data-h2-display="base(flex)"
      data-h2-align-items="base(center)"
      data-h2-justify-content="base(center)"
      style={{
        backgroundColor: inline ? undefined : `rgba(255,255,255,0.95)`,
        bottom: 0,
        left: "1rem",
        right: "1rem",
        top: 0,
        zIndex: 9999,
      }}
    >
      <div {...inlineWrapper[inline === true ? "inline" : "none"]}>
        <span className="lds-dual-ring">
          <span data-h2-visibility="base(invisible)">
            {intl.formatMessage({
              defaultMessage: "Loading...",
              description: "Message to display when a page is loading.",
            })}
          </span>
        </span>
      </div>
    </div>
  );
};

export default Loading;
