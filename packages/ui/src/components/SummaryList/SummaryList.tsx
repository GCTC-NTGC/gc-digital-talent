import { type ComponentPropsWithRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { SummaryListContext } from "./SummaryContext";
import type { SummaryListContextValue } from "./SummaryContext";

const root = tv({
  base: "bg-white dark:bg-gray-600",
  variants: {
    mode: {
      simple: "",
      card: "rounded-md shadow-xl",
    },
  },
  defaultVariants: {
    mode: "simple",
  },
});

interface SummaryListProps
  extends
    Omit<ComponentPropsWithRef<"ul">, "color">,
    VariantProps<typeof root>,
    Omit<SummaryListContextValue, "inList"> {}

/**
 * Container for a list of `SummaryItem.Root` elements.
 *
 * Renders a `<ul>` and provides color, striped, and divider context to all
 * child items.
 *
 * @example
 * <SummaryList color="primary" divider="timeline">
 *   <SummaryItem.Root>…</SummaryItem.Root>
 * </SummaryList>
 */
const SummaryList = ({
  children,
  className,
  striped,
  mode,
  color = "primary",
  divider,
  ref,
  ...rest
}: SummaryListProps) => (
  <SummaryListContext.Provider
    value={{ striped, color, divider, inList: true }}
  >
    <ul ref={ref} className={root({ mode, class: className })} {...rest}>
      {children}
    </ul>
  </SummaryListContext.Provider>
);

export default SummaryList;
