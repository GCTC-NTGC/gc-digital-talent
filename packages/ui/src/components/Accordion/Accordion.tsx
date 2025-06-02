/**
 * Documentation: https://www.radix-ui.com/docs/primitives/components/accordion
 */
import ChevronRightIcon from "@heroicons/react/24/solid/ChevronRightIcon";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ComponentPropsWithoutRef,
  forwardRef,
  ElementRef,
  ReactNode,
  Fragment,
  createContext,
  useContext,
} from "react";
import { tv, VariantProps } from "tailwind-variants";

import { assertUnreachable } from "@gc-digital-talent/helpers";

import type { Color, HeadingRank, IconType } from "../../types";
import Chip, { ChipVariants } from "../Chip/Chip";
import Link from "../Link";
import Button from "../Button";
import MetaDataStatusItem, {
  AccordionMetaDataStatusItemProps,
} from "./MetaDataStatusItem";

const root = tv({
  base: "group flex flex-col",
  variants: {
    mode: {
      simple: "",
      card: "overflow-hidden rounded-md bg-white shadow-lg dark:bg-gray-600",
    },
    // NOTE: Stub sizes for nested components
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
});

type AccordionVariants = VariantProps<typeof root>;
export type AccordionMode = NonNullable<AccordionVariants["mode"]>;
type RootPrimitiveProps = ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Root
>;

const AccordionVariantContext = createContext<AccordionVariants>({
  mode: "simple",
  size: "md",
});

type RootProps = AccordionVariants & RootPrimitiveProps;

const Root = forwardRef<ElementRef<typeof AccordionPrimitive.Root>, RootProps>(
  ({ mode = "simple", size = "md", ...rest }, forwardedRef) => (
    <AccordionVariantContext.Provider value={{ mode, size }}>
      <AccordionPrimitive.Root
        ref={forwardedRef}
        className={root({ mode })}
        {...rest}
      />
    </AccordionVariantContext.Provider>
  ),
);

const item = tv({
  base: "overflow-hidden",
  variants: {
    mode: {
      simple: "",
      card: "not-last:border-b not-last:border-b-gray-100 even:bg-gray-100/30 dark:not-last:border-b-gray-700 dark:odd:bg-gray-700/30 dark:even:bg-gray-700/50",
    },
  },
});

const Item = forwardRef<
  ElementRef<typeof AccordionPrimitive.Item>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>((props, forwardedRef) => {
  const { mode } = useContext(AccordionVariantContext);
  return (
    <AccordionPrimitive.Item
      className={item({ mode })}
      ref={forwardedRef}
      {...props}
    />
  );
});

const trigger = tv({
  slots: {
    header: "flex items-start justify-between gap-3",
    btn: "group/btn flex grow items-start gap-x-3 text-left outline-none",
    heading: "m-0 text-lg/none font-bold lg:text-xl/none",
    iconSize: "shrink-0",
    ctx: "flex items-center gap-x-3",
  },
  variants: {
    hasContext: {
      true: {
        header: "flex-col xs:flex-row",
        ctx: "xs:pl-0",
      },
    },
    mode: {
      simple: {
        header: "py-3",
      },
      card: {
        header: "p-6",
      },
    },
    size: {
      sm: {
        heading: "text-base/[1.1] lg:text-lg/[1.1]",
        iconSize: "size-3 lg:size-4",
      },
      md: {
        heading: "text-lg/[1.1] lg:text-xl/[1.1]",
        iconSize: "size-4 lg:size-5",
      },
      lg: {
        heading: "text-xl/[1.1] lg:text-2xl/[1.1]",
        iconSize: "size-5 lg:size-6",
      },
    },
  },
  compoundVariants: [
    {
      hasContext: true,
      size: "sm",
      mode: "simple",
      class: {
        ctx: "pl-8",
      },
    },
    {
      hasContext: true,
      size: "md",
      mode: "simple",
      class: {
        ctx: "pl-9",
      },
    },
    {
      hasContext: true,
      size: "lg",
      mode: "simple",
      class: {
        ctx: "pl-10",
      },
    },
    {
      hasContext: true,
      size: "sm",
      mode: "card",
      class: {
        ctx: "pl-8",
      },
    },
    {
      hasContext: true,
      size: "md",
      mode: "card",
      class: {
        ctx: "pl-9",
      },
    },
    {
      hasContext: true,
      size: "lg",
      mode: "card",
      class: {
        ctx: "pl-10",
      },
    },
  ],
});

interface AccordionHeaderProps
  extends ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  as?: HeadingRank | "p";
  icon?: IconType;
  subtitle?: ReactNode;
  context?: ReactNode;
  titleProps?: ComponentPropsWithoutRef<typeof AccordionPrimitive.Header>;
}

const Trigger = forwardRef<
  ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionHeaderProps
>(
  (
    { as = "h2", subtitle, icon, context, titleProps, children, ...rest },
    forwardedRef,
  ) => {
    const Heading = as;
    const Icon = icon;
    const { mode, size } = useContext(AccordionVariantContext);
    const { header, btn, iconSize, heading, ctx } = trigger({
      mode,
      size,
      hasContext: !!context,
    });

    return (
      <AccordionPrimitive.Header className={header()} {...titleProps}>
        <AccordionPrimitive.Trigger
          ref={forwardedRef}
          className={btn()}
          {...rest}
        >
          <span className="-mt-0.5 rounded-full p-1 transition-colors duration-150 group-focus-visible/btn:bg-focus group-focus-visible/btn:text-black">
            <ChevronRightIcon
              className={iconSize({
                class:
                  "rotate-0 transform leading-none transition-transform duration-150 group-data-[state=open]/btn:rotate-90",
              })}
            />
          </span>
          <span className="flex grow flex-col">
            <Heading className={heading()}>{children}</Heading>
            {subtitle && (
              <span className="dark:text-gray-200m mt-1 text-sm">
                {subtitle}
              </span>
            )}
          </span>
        </AccordionPrimitive.Trigger>
        {(!!Icon || !!context) && (
          <span className={ctx()}>
            {context && <span>{context}</span>}
            {Icon && <Icon className={iconSize()} />}
          </span>
        )}
      </AccordionPrimitive.Header>
    );
  },
);

// every item must have a key and type
interface AccordionMetaDataText {
  key: string;
  children: ReactNode;
  type: "text";
}

interface AccordionMetaDataButton {
  key: string;
  type: "button";
  color?: Color;
  onClick?: () => void;
  children: ReactNode;
}

interface AccordionMetaDataLink {
  key: string;
  type: "link";
  color?: Color;
  children: ReactNode;
  href?: string;
}

interface AccordionMetaDataChip {
  key: string;
  type: "chip";
  children: ReactNode;
  color?: ChipVariants["color"];
}

// status items have their own prop interface
interface AccordionMetaDataStatusItem extends AccordionMetaDataStatusItemProps {
  key: string;
  type: "status_item";
}

type AccordionMetaDataItem =
  | AccordionMetaDataText
  | AccordionMetaDataButton
  | AccordionMetaDataLink
  | AccordionMetaDataChip
  | AccordionMetaDataStatusItem;

interface MetaDataItemProps {
  datum: AccordionMetaDataItem;
}

const MetaDataItem = ({ datum }: MetaDataItemProps) => {
  switch (datum.type) {
    case "text":
      return (
        <span className="font-normal text-gray-600 dark:text-gray-100">
          {datum.children}
        </span>
      );
    case "chip":
      return <Chip color={datum?.color}>{datum.children}</Chip>;
    case "button":
      return (
        <Button
          mode="inline"
          color={datum.color ?? "primary"}
          fontSize="caption"
          onClick={datum.onClick}
          key={datum.key}
        >
          {datum.children}
        </Button>
      );
    case "link":
      return (
        <Link
          color={datum.color ?? "primary"}
          href={datum.href}
          mode="inline"
          fontSize="caption"
          key={datum.key}
        >
          {datum.children}
        </Link>
      );
    // just wrap with a key and display "as-is"
    case "status_item":
      return <MetaDataStatusItem label={datum.label} status={datum.status} />;
    default:
      return assertUnreachable(datum);
  }
};

export interface AccordionMetaDataProps {
  metadata: (
    | AccordionMetaDataText
    | AccordionMetaDataButton
    | AccordionMetaDataLink
    | AccordionMetaDataChip
    | AccordionMetaDataStatusItem
  )[];
}

export type AccordionMetaData = AccordionMetaDataProps["metadata"];

const metaWrapper = tv({
  base: "flex flex-col flex-nowrap items-start gap-2 text-sm xs:flex-row xs:flex-wrap xs:items-center",
  variants: {
    mode: {
      simple: "mb-3",
      card: "-mt-3 pb-6",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  compoundVariants: [
    {
      size: "sm",
      mode: "simple",
      class: "pl-8 lg:pl-9",
    },
    {
      size: "md",
      mode: "simple",
      class: "pl-9 lg:pl-10",
    },
    {
      size: "lg",
      mode: "simple",
      class: "pl-10 lg:pl-11",
    },
    {
      size: "sm",
      mode: "card",
      class: "pl-14 lg:pl-15",
    },
    {
      size: "md",
      mode: "card",
      class: "pl-15 lg:pl-16",
    },
    {
      size: "lg",
      mode: "card",
      class: "pl-16 lg:pl-17",
    },
  ],
});

const MetaData = ({ metadata }: AccordionMetaDataProps) => {
  const { mode, size } = useContext(AccordionVariantContext);
  return (
    <div className={metaWrapper({ mode, size })}>
      {metadata.map((datum, index) => (
        <Fragment key={datum.key}>
          {index > 0 && (
            <span
              aria-hidden="true"
              className="mx-3 hidden text-gray-300 xs:inline-block dark:text-gray-200"
              // eslint-disable-next-line formatjs/no-literal-string-in-jsx
            >
              &bull;
            </span>
          )}
          <MetaDataItem datum={datum} />
        </Fragment>
      ))}
    </div>
  );
};

const content = tv({
  base: "pb-6 text-black dark:text-white",
  variants: {
    mode: {
      simple: "",
      card: "",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  compoundVariants: [
    {
      size: "sm",
      mode: "simple",
      class: "pl-8 lg:pl-9",
    },
    {
      size: "md",
      mode: "simple",
      class: "pl-9 lg:pl-10",
    },
    {
      size: "lg",
      mode: "simple",
      class: "pl-10 lg:pl-11",
    },
    {
      size: "sm",
      mode: "card",
      class: "pl-14 lg:pl-15",
    },
    {
      size: "md",
      mode: "card",
      class: "pl-15 lg:pl-16",
    },
    {
      size: "lg",
      mode: "card",
      class: "pl-16 lg:pl-17",
    },
  ],
});

const Content = forwardRef<
  ElementRef<typeof AccordionPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ children, ...rest }, forwardedRef) => {
  const { mode, size } = useContext(AccordionVariantContext);
  return (
    <AccordionPrimitive.Content
      className={content({ mode, size })}
      ref={forwardedRef}
      {...rest}
    >
      {children}
    </AccordionPrimitive.Content>
  );
});

/**
 * @name Accordion
 * @desc A vertically stacked set of interactive headings that each reveal an associated section of content.
 * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/accordion)
 */
const Accordion = {
  /**
   * @name Root
   * @desc Contains all the parts of an accordion.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/accordion#root)
   */
  Root,
  /**
   * @name Item
   * @desc Contains all the parts of a collapsible section.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/accordion#item)
   */
  Item,
  /**
   * @name Trigger
   * @desc Toggles the collapsed state of its associated item. It should be nested inside of an Accordion.Header.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/accordion#trigger)
   */
  Trigger,
  /**
   * @name MetaData
   * @desc Adds metadata below trigger.
   */
  MetaData,
  /**
   * @name Content
   * @desc Contains the collapsible content for an item.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/accordion#content)
   */
  Content,
};

export default Accordion;
