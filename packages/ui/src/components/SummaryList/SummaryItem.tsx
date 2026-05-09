import type { ComponentPropsWithRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import Action from "./SummaryAction";
import Box from "../Box/Box";
import type { HeadingProps } from "../Heading";
import Heading from "../Heading";
import {
  useSummaryItem,
  useSummaryList,
  SummaryItemContext,
} from "./SummaryContext";
import type { SummaryColor } from "./SummaryContext";
import TimelineMarker from "./TimelineMarker";

const item = tv({
  base: "group/item relative z-1 flex gap-x-3 px-9 py-7.5",
  variants: {
    striped: {
      true: "odd:bg-gray-100/20 dark:odd:bg-gray-700/40",
    },
    divider: {
      line: "not-last:border-b not-last:border-b-gray-200 dark:not-last:border-b-gray-700",
      timeline: "",
    },
  },
  defaultVariants: {
    striped: false,
  },
});

// striped / divider are injected from context; not exposed as props
type ItemVariants = Omit<VariantProps<typeof item>, "striped" | "divider">;

interface SummaryItemProps
  extends Omit<ComponentPropsWithRef<"li">, "color">,
    ItemVariants {
  color?: SummaryColor;
}

/**
 * A single row in a summary list (or a standalone card when used outside
 * `SummaryList.Root`).
 *
 * Renders as `<li>` inside a list and `<div>` when standalone. Accepts an
 * optional `color` override that takes precedence over the list-level color.
 */
function SummaryItem({
  className,
  color: colorProp,
  children,
  ...rest
}: SummaryItemProps) {
  const { inList, striped, color: listColor = "primary", divider } = useSummaryList();
  const color = colorProp ?? listColor;
  const cls = item({ striped, divider, class: className });

  return (
    <SummaryItemContext.Provider value={{ color }}>
      {inList ? (
        <Box<"li"> as="li" className={cls} {...rest}>
          {divider === "timeline" && <TimelineMarker />}
          {children}
        </Box>
      ) : (
        <Box<"div"> as="div" className={cls} {...rest}>
          {children}
        </Box>
      )}
    </SummaryItemContext.Provider>
  );
}

const content = tv({
  base: "order-3 grow",
});

type ContentProps = ComponentPropsWithRef<"div">;

/** Primary content area of a summary item. Grows to fill available horizontal space. */
const Content = ({ className, ...rest }: ContentProps) => {
  return <div className={content({ class: className })} {...rest} />;
};

const title = tv({
  base: "mt-0 mb-1 text-base/relaxed font-bold group-has-[.summary-action.expanded]/item:underline lg:text-base/relaxed",
  variants: {
    color: {
      primary: [
        "group-has-[.summary-action.expanded:hover]/item:text-primary-700",
        "dark:group-has-[.summary-action.expanded:hover]/item:text-primary-100",
      ],
      secondary: [
        "group-has-[.summary-action.expanded:hover]/item:text-secondary-700",
        "dark:group-has-[.summary-action.expanded:hover]/item:text-secondary-100",
      ],
      success: [
        "group-has-[.summary-action.expanded:hover]/item:text-success-700",
        "dark:group-has-[.summary-action.expanded:hover]/item:text-success-100",
      ],
      warning: [
        "group-has-[.summary-action.expanded:hover]/item:text-warning-700",
        "dark:group-has-[.summary-action.expanded:hover]/item:text-warning-100",
      ],
      error: [
        "group-has-[.summary-action.expanded:hover]/item:text-error-700",
        "dark:group-has-[.summary-action.expanded:hover]/item:text-error-100",
      ],
    },
  },
});

/**
 * Heading for a summary item. Underlines and changes color on hover when the
 * item contains an `expand` action button, turning the whole item into a link.
 */
const Title = ({ className, ...rest }: Omit<HeadingProps, "size">) => {
  const { color } = useSummaryItem();
  return <Heading className={title({ color, class: className })} {...rest} />;
};

const meta = tv({
  base: "mt-3 flex flex-col gap-3 justify-self-start sm:flex-row",
  variants: {
    separator: {
      true: "sm:*:not-last:after:ml-3 sm:*:not-last:after:text-gray/50 sm:*:not-last:after:content-['•']",
    },
  },
});

interface MetaProps
  extends ComponentPropsWithRef<"div">, VariantProps<typeof meta> {}

/**
 * Secondary metadata row rendered below the item body.
 *
 * Pass `separator` to add a bullet (`•`) between children on wider viewports.
 */
const Meta = ({ className, separator, ...rest }: MetaProps) => (
  <div className={meta({ separator, class: className })} {...rest} />
);

export default {
  Root: SummaryItem,
  Content,
  Title,
  Meta,
  Action: Action.Root,
  ActionButton: Action.Button,
  ActionLink: Action.Link,
  ActionMenu: Action.Menu,
};
