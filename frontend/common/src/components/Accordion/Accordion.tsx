/**
 * Documentation: https://www.radix-ui.com/docs/primitives/components/accordion
 */
import React from "react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import type { HeadingRank } from "../../types/primitiveTypes";

const Root = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  | AccordionPrimitive.AccordionMultipleProps
  | AccordionPrimitive.AccordionSingleProps
>((props, forwardedRef) => (
  <AccordionPrimitive.Root
    className="Accordion"
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column)"
    ref={forwardedRef}
    {...props}
  />
));

const Item = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>((props, forwardedRef) => (
  <AccordionPrimitive.Item
    data-h2-border-left="
      base(x.5 solid dt-secondary)
      base:selectors[[data-state='open']](x.5 solid dt-primary)"
    data-h2-margin="base(x.25, 0)"
    data-h2-shadow="base(l)"
    data-h2-radius="base(0px, s, s, 0px)"
    data-h2-overflow="base(hidden)"
    data-h2-transition="base(all, 100ms, ease-in)"
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
    data-h2-align-items="base(center)"
    data-h2-background-color="base(dt-white)"
    data-h2-cursor="base(pointer)"
    data-h2-display="base(flex)"
    data-h2-gap="base(0, x.5)"
    data-h2-padding="base(x1, x1, x1, x.5)"
    data-h2-justify-content="base(space-between)"
    data-h2-text-align="base(left)"
    data-h2-width="base(100%)"
    data-h2-transform="
      base:children[.Accordion__Chevron](rotate(0deg))
      base:selectors[[data-state='open']]:children[.Accordion__Chevron](rotate(90deg))"
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
            <div data-h2-margin="base(0, x.25, 0, 0)" style={{ flexShrink: 0 }}>
              <ChevronRightIcon
                className="Accordion__Chevron"
                data-h2-width="base(x1.5)"
                data-h2-transition="base(all, 100ms, ease-in)"
              />
            </div>
            <div data-h2-flex-grow="base(1)">
              <span
                data-h2-display="base(block)"
                data-h2-font-size="base(h6, 1)"
                data-h2-font-weight="base(700)"
              >
                {children}
              </span>
              {subtitle && (
                <span
                  data-h2-display="base(block)"
                  data-h2-font-size="base(copy, 1)"
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
    data-h2-background-color="base(dt-white)"
    ref={forwardedRef}
    {...rest}
  >
    <div data-h2-padding="base(0, x1, x1, x2.5)">
      <hr
        data-h2-background-color="base(dt-gray)"
        data-h2-height="base(1px)"
        data-h2-width="base(100%)"
        data-h2-border="base(none)"
        data-h2-margin="base(0, 0, x1, 0)"
      />
      {children}
    </div>
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
