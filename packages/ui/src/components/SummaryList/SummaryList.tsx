import { type ComponentPropsWithRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import SummaryItem from "./SummaryItem";
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

interface RootProps
  extends ComponentPropsWithRef<"ul">,
    VariantProps<typeof root>,
    Omit<SummaryListContextValue, "inList"> {}

/**
 * Container for a list of summary items.
 *
 * Renders a `<ul>` and provides color, striped, and divider context to all
 * child `SummaryList.Item` elements.
 *
 * @example
 * <SummaryList.Root color="primary" divider="timeline">
 *   <SummaryList.Item>…</SummaryList.Item>
 * </SummaryList.Root>
 */
const Root = ({
  children,
  className,
  striped,
  mode,
  color = "primary",
  divider,
  ref,
}: RootProps) => (
  <SummaryListContext.Provider
    value={{ striped, color, divider, inList: true }}
  >
    <ul ref={ref} className={root({ mode, class: className })}>
      {children}
    </ul>
  </SummaryListContext.Provider>
);

const Item = Object.assign(SummaryItem.Root, {
  Content: SummaryItem.Content,
  Title: SummaryItem.Title,
  Action: SummaryItem.Action,
  Meta: SummaryItem.Meta,
  ActionButton: SummaryItem.ActionButton,
  ActionLink: SummaryItem.ActionLink,
  ActionMenu: SummaryItem.ActionMenu,
});

export default { Root, Item };
