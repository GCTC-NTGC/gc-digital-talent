import { type ReactNode, type RefObject } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import SummaryItem from "./SummaryItem";
import { SummaryListContext } from "./SummaryContext";
import type { SummaryColor } from "./SummaryContext";

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

interface RootProps extends VariantProps<typeof root> {
  children: ReactNode;
  className?: string;
  ref?: RefObject<HTMLUListElement>;
  timeline?: boolean;
  color?: SummaryColor;
  striped?: boolean;
}

const Root = ({
  children,
  className,
  striped,
  mode,
  color = "primary",
  timeline = false,
  ref,
}: RootProps) => (
  <SummaryListContext.Provider
    value={{ striped, color, timeline, inList: true }}
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
