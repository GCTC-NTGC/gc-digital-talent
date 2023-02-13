import React from "react";

export interface LoadingProps {
  inline?: boolean;
  children?: React.ReactNode;
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

const Loading = ({
  inline = false,
  live,
  children,
}: LoadingProps): JSX.Element => {
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
      "data-h2-location": "base(0, x1)",
      "data-h2-margin": "base(x1, 0)",
    },
    full: {
      "data-h2-position": "base(fixed)",
      "data-h2-background-color": "base(dt-white.95)",
      "data-h2-location": "base(0)",
      "data-h2-z-index": "base(9999)",
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
    >
      <div {...inlineWrapper[inline === true ? "inline" : "none"]}>
        <span className="lds-dual-ring">
          <span data-h2-visually-hidden="base(invisible)">{children}</span>
        </span>
      </div>
    </div>
  );
};

export default Loading;
