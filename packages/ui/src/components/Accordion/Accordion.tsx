/**
 * Documentation: https://www.radix-ui.com/docs/primitives/components/accordion
 */
import React from "react";
import ChevronDownIcon from "@heroicons/react/24/solid/ChevronDownIcon";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import type { HeadingRank, IconType } from "../../types";
import { AccordionMode } from "./types";

type RootProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Root
> & {
  mode?: AccordionMode;
  spaced?: boolean;
};

const Root = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  RootProps
>(({ mode = "card", spaced, ...rest }, forwardedRef) => {
  let styles: Record<string, string> = {
    "data-h2-padding":
      "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Trigger](x1 0) base:selectors[>.Accordion__Item > .Accordion__Content](0 x1 x1 x1.5)",
  };

  if (mode === "card") {
    styles = {
      "data-h2-background-color":
        "base:selectors[>.Accordion__Item](foreground)",
      "data-h2-padding":
        "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Trigger](x1) base:selectors[>.Accordion__Item > .Accordion__Content](0 x1 x1 x2.5)",
      ...(spaced
        ? {
            "data-h2-gap": "base(x1 0)",
            "data-h2-radius": "base:selectors[>.Accordion__Item](s)",
            "data-h2-shadow": "base:selectors[>.Accordion__Item](l)",
          }
        : {
            "data-h2-border-bottom":
              "base:selectors[>.Accordion__Item:nth-of-type(n+1)](thin solid gray)",
            "data-h2-radius":
              "base(s) base:selectors[>.Accordion__Item:first-of-type](s s 0 0) base:selectors[>.Accordion__Item:last-child](0 0 s s)",
            "data-h2-shadow": "base(l)",
          }),
    };
  }

  return (
    <AccordionPrimitive.Root
      ref={forwardedRef}
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      {...styles}
      {...rest}
    />
  );
});

const Item = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>((props, forwardedRef) => (
  <AccordionPrimitive.Item
    className="Accordion__Item"
    data-h2-overflow="base(hidden)"
    ref={forwardedRef}
    {...props}
  />
));

export interface AccordionHeaderProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  as?: HeadingRank | "p";
  icon?: IconType;
  subtitle?: React.ReactNode;
  context?: React.ReactNode;
  titleProps?: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Header>;
}

const Trigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionHeaderProps
>(
  (
    { as = "h2", subtitle, icon, context, titleProps, children, ...rest },
    forwardedRef,
  ) => {
    const Heading = as;
    const Icon = icon;

    return (
      <AccordionPrimitive.Header className="Accordion__Header" {...titleProps}>
        <AccordionPrimitive.Trigger
          ref={forwardedRef}
          className="Accordion__Trigger"
          data-h2-align-items="base(flex-start)"
          data-h2-background-color="base(transparent) base:focus-visible(focus)"
          data-h2-color="base(black) base:focus-visible(black) base:selectors[.Accordion__Subtitle](black.light) base:focus-visible:selectors[.Accordion__Subtitle](black)"
          data-h2-cursor="base(pointer)"
          data-h2-display="base(flex)"
          data-h2-gap="base(0, x.5)"
          data-h2-outline="base(none)"
          data-h2-justify-content="base(flex-start)"
          data-h2-text-align="base(left)"
          data-h2-width="base(100%)"
          data-h2-shadow="base:focus-visible:children[.Accordion__Chevron](focus)"
          data-h2-transform="
            base:children[.Accordion__Chevron__Icon](rotate(0deg))
            base:selectors[[data-state='open']]:children[.Accordion__Chevron__Icon](rotate(-180deg))"
          {...rest}
        >
          <span
            className="Accordion__Chevron"
            data-h2-display="base(flex)"
            data-h2-align-items="base(center)"
            data-h2-flex-shrink="base(0)"
            data-h2-radius="base(circle)"
          >
            <ChevronDownIcon
              className="Accordion__Chevron__Icon"
              data-h2-transition="base(transform 150ms ease)"
              data-h2-width="base(x1)"
            />
          </span>

          <span
            data-h2-flex-grow="base(1)"
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-gap="base(x.25 0)"
          >
            <Heading
              data-h2-font-size="base(body)"
              data-h2-margin="base(0)"
              data-h2-font-weight="base(700)"
            >
              {children}
            </Heading>
            {subtitle && (
              <span
                className="Accordion__Subtitle"
                data-h2-font-size="base(copy)"
              >
                {subtitle}
              </span>
            )}
          </span>

          {(Icon || context) && (
            <span
              data-h2-align-items="base(center)"
              data-h2-display="base(flex)"
              data-h2-gap="base(0 x.25)"
            >
              {context && (
                <span data-h2-font-size="base(caption)">{context}</span>
              )}
              {Icon && <Icon data-h2-width="base(x1)" />}
            </span>
          )}
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    );
  },
);

const Content = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ children, ...rest }, forwardedRef) => (
  <AccordionPrimitive.Content
    className="Accordion__Content"
    ref={forwardedRef}
    {...rest}
  >
    {children}
  </AccordionPrimitive.Content>
));

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
   * @name Content
   * @desc Contains the collapsible content for an item.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/accordion#content)
   */
  Content,
};

export default Accordion;
