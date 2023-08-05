/**
 * Documentation: https://www.radix-ui.com/docs/primitives/components/accordion
 */
import React from "react";
import { motion } from "framer-motion";
import ChevronDownIcon from "@heroicons/react/24/solid/ChevronDownIcon";
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

type AccordionHeaderPrimitivePropsWithoutRef = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Header
>;
export interface AccordionHeaderProps
  extends AccordionHeaderPrimitivePropsWithoutRef {
  headingAs?: HeadingRank;
}

const Header = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Header>,
  AccordionHeaderProps
>(({ headingAs = "h2", children, ...rest }, forwardedRef) => {
  const Heading = headingAs;
  return (
    <StyledHeader asChild ref={forwardedRef} {...rest}>
      <Heading data-h2-line-height="base(1)">{children}</Heading>
    </StyledHeader>
  );
});

const StyledTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>((props, forwardedRef) => (
  <AccordionPrimitive.Trigger
    className="Accordion__Trigger"
    data-h2-align-items="base(flex-start)"
    data-h2-background-color="base(transparent) base:focus-visible:children[.Accordion__Chevron](focus)"
    data-h2-color="base(black) base:focus-visible:children[.Accordion__Chevron](black)"
    data-h2-cursor="base(pointer)"
    data-h2-display="base(flex)"
    data-h2-gap="base(0, x1)"
    data-h2-outline="base(none)"
    data-h2-justify-content="base(flex-start)"
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

const Trigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerPrimitivePropsWithoutRef
>(({ children, ...rest }, forwardedRef) => {
  return (
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

      {children}
    </StyledTrigger>
  );
});

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
        data-h2-background-color="base(gray.lighter)"
        data-h2-width="base(100%)"
        data-h2-border="base(none)"
      />
      {children}
    </>
  </AccordionPrimitive.Content>
));

type AnimatedContentProps = React.ComponentPropsWithoutRef<typeof Content> & {
  isOpen: boolean;
};

const animationVariants = {
  open: {
    height: "auto",
    opacity: 1,
  },
  closed: {
    height: 0,
    opacity: 0,
  },
};

const AnimatedContent = React.forwardRef<
  React.ElementRef<typeof Content>,
  AnimatedContentProps
>(({ isOpen, children, ...rest }, forwardedRef) => (
  <Content asChild forceMount ref={forwardedRef} {...rest}>
    <motion.div
      className="Accordion__Content"
      animate={isOpen ? "open" : "closed"}
      variants={animationVariants}
      transition={{ duration: 0.2, type: "tween" }}
    >
      {children}
    </motion.div>
  </Content>
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
   * @name Header
   * @desc Wraps an Accordion.Trigger. Use the asChild prop to update it to the appropriate heading level for your page.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/accordion#header)
   */
  Header,
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
  /**
   * @name AnimatedContent
   * @description
   */
  AnimatedContent,
};

export default Accordion;
