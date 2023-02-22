/**
 * Documentation: https://www.radix-ui.com/docs/primitives/components/accordion
 */
import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import type { HeadingRank } from "../../types";

import { AccordionMode } from "./types";
import styleMap from "./styles";

type RootProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Root
> & {
  mode?: AccordionMode;
};

const Root = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  RootProps
>(({ mode = "card", ...rest }, forwardedRef) => {
  const styles = styleMap?.get(mode);

  return <AccordionPrimitive.Root {...styles} {...rest} ref={forwardedRef} />;
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

const StyledHeader = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Header>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Header>
>((props, forwardedRef) => (
  <AccordionPrimitive.Header
    className="Accordion__Header"
    ref={forwardedRef}
    {...props}
  />
));

const StyledTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>((props, forwardedRef) => (
  <AccordionPrimitive.Trigger
    className="Accordion__Trigger"
    data-h2-align-items="base(flex-start)"
    data-h2-background-color="base(transparent) base:focus-visible:children[.Accordion__Chevron](focus)"
    data-h2-color="base:focus-visible:children[.Accordion__Chevron](black)"
    data-h2-cursor="base(pointer)"
    data-h2-display="base(flex)"
    data-h2-gap="base(0, x1)"
    data-h2-outline="base(none)"
    data-h2-justify-content="base(space-between)"
    data-h2-text-align="base(left)"
    data-h2-width="base(100%)"
    data-h2-shadow="base:focus-visible:children[.Accordion__Chevron](focus)"
    data-h2-transform="
      base:children[.Accordion__Chevron__Icon](rotate(0deg))
      base:selectors[[data-state='open']]:children[.Accordion__Chevron__Icon](rotate(-180deg))"
    ref={forwardedRef}
    {...props}
  />
));

type AccordionTriggerPrimitivePropsWithoutRef = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Trigger
>;
export interface AccordionTriggerProps
  extends AccordionTriggerPrimitivePropsWithoutRef {
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  context?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAs?: HeadingRank;
}

const Trigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(
  (
    { Icon, context, subtitle, headerAs = "h2", children, ...rest },
    forwardedRef,
  ) => {
    const Header = headerAs;
    return (
      <StyledHeader asChild>
        <Header data-h2-line-height="base(1)">
          <StyledTrigger ref={forwardedRef} {...rest}>
            <div
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
            </div>
            <div
              data-h2-flex-grow="base(1)"
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-gap="base(x.5 0)"
            >
              <span
                data-h2-display="base(block)"
                data-h2-font-size="base(h6, 1)"
                data-h2-font-weight="base(700)"
              >
                {children}
              </span>
              {subtitle && (
                <span
                  className="Accordion__Subtitle"
                  data-h2-display="base(block)"
                  data-h2-font-size="base(h6, 1)"
                  data-h2-margin="base(x.25, 0, 0, 0)"
                >
                  {subtitle}
                </span>
              )}
            </div>
            <div
              className="accordion-header-context"
              data-h2-align-items="base(center)"
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(row)"
              style={{ flexShrink: 0 }}
            >
              {context && <p data-h2-font-size="base(copy)">{context}</p>}
              {Icon && (
                <span className="icon" data-h2-margin="base(0, 0, 0, x1)">
                  <Icon
                    data-h2-width="base(x1.2)"
                    data-h2-margin="base(x.125, 0, 0, 0)"
                  />
                </span>
              )}
            </div>
          </StyledTrigger>
        </Header>
      </StyledHeader>
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
    <>
      <hr
        className="Accordion__Separator"
        data-h2-background-color="base(gray)"
        data-h2-width="base(100%)"
        data-h2-border="base(none)"
      />
      {children}
    </>
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
  Trigger,
  /**
   * @name Content
   * @desc Contains the collapsible content for an item.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/accordion#content)
   */
  Content,
};

export default Accordion;
