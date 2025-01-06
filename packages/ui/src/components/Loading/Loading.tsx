import { m, useReducedMotion } from "motion/react";
import { HTMLProps, ReactNode } from "react";

export interface LoadingProps extends HTMLProps<HTMLDivElement> {
  inline?: boolean;
  children?: ReactNode;
  /** Pause the animation */
  pause?: boolean;
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
  pause = false,
  live,
  children,
  ...rest
}: LoadingProps) => {
  const shouldReduceMotion = useReducedMotion();
  const inlineWrapper = {
    inline: {
      "data-h2-background-color": "base(white)",
      "data-h2-padding": "base(x.25)",
      "data-h2-position": "base(relative)",
      "data-h2-height": "base(x1.5)",
      "data-h2-width": "base(x1.5)",
      "data-h2-radius": "base(100%)",
    },
    none: {},
  };
  const typeMap = {
    inline: {
      "data-h2-position": "base(relative)",
      "data-h2-margin": "base(x1)",
    },
    full: {
      "data-h2-position": "base(fixed)",
      "data-h2-background-color": "base(white.95)",
      "data-h2-location": "base(0)",
      "data-h2-z-index": "base(9999)",
    },
  };

  return (
    <div
      aria-busy="true"
      {...typeMap[inline ? "inline" : "full"]}
      {...(live && {
        "aria-live": live,
      })}
      data-h2-display="base(flex)"
      data-h2-align-items="base(center)"
      data-h2-justify-content="base(center)"
      {...rest}
    >
      <div {...inlineWrapper[inline === true ? "inline" : "none"]}>
        <span data-h2-display="base(inline-block)">
          <span data-h2-visually-hidden="base(invisible)">{children}</span>
          <m.span
            data-h2-display="base(block)"
            data-h2-height="base(x1)"
            data-h2-width="base(x1)"
            data-h2-radius="base(50%)"
            data-h2-border-width="base(6px)"
            data-h2-border-style="base(solid)"
            data-h2-border-color="base(primary transparent primary transparent)"
            {...(!pause &&
              !shouldReduceMotion && {
                animate: {
                  rotate: [0, 360],
                },
                transition: {
                  ease: "linear",
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 0,
                },
              })}
          />
        </span>
      </div>
    </div>
  );
};

export default Loading;
