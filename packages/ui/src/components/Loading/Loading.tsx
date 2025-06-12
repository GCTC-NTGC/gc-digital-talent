import { m, useReducedMotion } from "motion/react";
import { HTMLProps, ReactNode } from "react";
import { tv } from "tailwind-variants";

const loading = tv({
  slots: {
    base: "grid place-items-center",
    wrapper: "relative",
  },
  variants: {
    inline: {
      false: {
        base: "fixed inset-0 z-[99999] bg-white/95 dark:bg-gray-700/95",
      },
      true: {
        base: "relative m-6",
        wrapper: "size-8 rounded-full bg-white shadow-sm dark:bg-gray-700",
      },
    },
  },
});

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
  const { base, wrapper } = loading({ inline });

  return (
    <div
      aria-busy="true"
      {...(live && {
        "aria-live": live,
      })}
      className={base()}
      {...rest}
    >
      <div className={wrapper()}>
        <span className="sr-only">{children}</span>
        <m.span
          className="absolute top-1/2 left-1/2 block size-6 -translate-1/2 transform rounded-full border-6 border-transparent border-t-secondary border-b-secondary iap:border-t-primary iap:border-b-primary"
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
      </div>
    </div>
  );
};

export default Loading;
