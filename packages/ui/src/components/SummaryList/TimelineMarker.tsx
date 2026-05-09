import { tv } from "tailwind-variants";

import { useSummaryItem } from "./SummaryContext";

// h-9.5 on the upper line = py-7.5 (1.875rem) + half of text-base/relaxed line-height (0.8125rem) − dot radius (0.3125rem)
// This centres the dot on the title's first line regardless of item height.
// invisible (not hidden) preserves the height so the dot never shifts position on first/last/only items.
const timelineMarker = tv({
  slots: {
    root: "pointer-events-none absolute inset-y-0 left-0 flex w-9 flex-col items-center",
    upper: "h-9.5 w-px group-first/item:invisible",
    dot: "size-2.5 shrink-0 rounded-full",
    lower: "w-px flex-1 group-last/item:invisible",
  },
  variants: {
    color: {
      primary: {
        upper: "bg-primary-600 dark:bg-primary-200",
        dot: "bg-primary-600 dark:bg-primary-200",
        lower: "bg-primary-600 dark:bg-primary-200",
      },
      secondary: {
        upper: "bg-secondary-600 dark:bg-secondary-200",
        dot: "bg-secondary-600 dark:bg-secondary-200",
        lower: "bg-secondary-600 dark:bg-secondary-200",
      },
      success: {
        upper: "bg-success-600 dark:bg-success-200",
        dot: "bg-success-600 dark:bg-success-200",
        lower: "bg-success-600 dark:bg-success-200",
      },
      warning: {
        upper: "bg-warning-600 dark:bg-warning-200",
        dot: "bg-warning-600 dark:bg-warning-200",
        lower: "bg-warning-600 dark:bg-warning-200",
      },
      error: {
        upper: "bg-error-600 dark:bg-error-200",
        dot: "bg-error-600 dark:bg-error-200",
        lower: "bg-error-600 dark:bg-error-200",
      },
    },
  },
});

const TimelineMarker = () => {
  const { color } = useSummaryItem();
  const { root, upper, dot, lower } = timelineMarker({ color });
  return (
    <div aria-hidden className={root()}>
      <div className={upper()} />
      <div className={dot()} />
      <div className={lower()} />
    </div>
  );
};

export default TimelineMarker;
