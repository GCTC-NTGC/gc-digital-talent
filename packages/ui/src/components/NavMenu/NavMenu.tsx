/**
 * This is different from tabs in that
 * it contains a `nav` element with `a` tags
 * and applies the appropriate `aria` attributes
 *
 * Documentation: https://www.radix-ui.com/docs/primitives/components/navigation-menu
 */
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { useLocation } from "react-router-dom";
import {
  forwardRef,
  ElementRef,
  ComponentPropsWithoutRef,
  useRef,
  useEffect,
} from "react";
import ChevronDownIcon from "@heroicons/react/24/solid/ChevronDownIcon";

import { useIsSmallScreen } from "@gc-digital-talent/helpers";

import OurLink from "../Link/Link";
import getButtonStyle, {
  ButtonStyleInterface,
} from "../../utils/button/getButtonStyles";
import { Color } from "../../types";
import { useNavMenuContext } from "./NavMenuProvider";

const Root = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Root>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>((props, forwardedRef) => (
  <div>
    <NavigationMenuPrimitive.Root ref={forwardedRef} {...props} />
  </div>
));

type TriggerProps = ComponentPropsWithoutRef<
  typeof NavigationMenuPrimitive.Trigger
> &
  ButtonStyleInterface;

const Trigger = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  TriggerProps
>(({ children, mode, color, block = false, ...rest }, forwardedRef) => (
  <div>
    <NavigationMenuPrimitive.Trigger
      ref={forwardedRef}
      {...getButtonStyle({ mode, color, block })}
      data-h2-text-decoration="base(underline)"
      data-h2-padding="base(0)"
      data-h2-transform="
      base:children[.Accordion__Icon--chevron](rotate(0deg))
      base:selectors[[data-state='open']]:children[.Accordion__Icon--chevron](rotate(180deg))"
      {...rest}
    >
      <span data-h2-margin-right="base(x.25)">{children}</span>
      <ChevronDownIcon
        className="Accordion__Icon Accordion__Icon--chevron"
        data-h2-transition="base(transform 150ms ease)"
        data-h2-width="base(x.75)"
        data-h2-height="base(x.75)"
        data-h2-vertical-align="base(middle)"
      />
    </NavigationMenuPrimitive.Trigger>
  </div>
));

const Content = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>((props, forwardedRef) => (
  <NavigationMenuPrimitive.Content
    ref={forwardedRef}
    data-h2-margin-top="base(x1) l-tablet(0)"
    data-h2-position="l-tablet(absolute)"
    data-h2-top="l-tablet(x1.25)"
    data-h2-left="l-tablet(-25%)"
    data-h2-background-color="l-tablet(foreground)"
    data-h2-padding="l-tablet(x.25 x.5)"
    data-h2-radius="l-tablet(s)"
    data-h2-shadow="l-tablet(s)"
    data-h2-width="l-tablet(150%)"
    {...props}
  />
));

const Viewport = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>((props, forwardedRef) => (
  <div>
    <NavigationMenuPrimitive.Viewport ref={forwardedRef} {...props} />
  </div>
));

const List = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.List>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ children, ...rest }, forwardedRef) => (
  <NavigationMenuPrimitive.List
    ref={forwardedRef}
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column)"
    data-h2-align-items="base(center) l-tablet(flex-start)"
    data-h2-margin="base(0)"
    data-h2-list-style="base(none)"
    data-h2-gap="base(x1)"
    data-h2-padding="base(0)"
    {...rest}
  >
    {children}
  </NavigationMenuPrimitive.List>
));

const Item = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Item>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>
>((props, forwardedRef) => (
  <NavigationMenuPrimitive.Item
    ref={forwardedRef}
    data-h2-position="l-tablet(relative)"
    {...props}
  />
));

type LinkProps = ComponentPropsWithoutRef<
  typeof NavigationMenuPrimitive.Link
> & {
  href: string;
  color?: Color;
};

const Link = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Link>,
  LinkProps
>(({ children, href, color, ...rest }, forwardedRef) => {
  const { pathname } = useLocation();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const isSmallScreen = useIsSmallScreen(1080);
  const navContext = useNavMenuContext();

  const isActive = pathname === href;

  useEffect(() => {
    if (linkRef.current) {
      linkRef.current.parentElement?.setAttribute(
        "data-state",
        isActive ? "active" : "inactive",
      );
    }
  }, [isActive]);

  return (
    <NavigationMenuPrimitive.Link
      ref={forwardedRef}
      active={isActive}
      onSelect={(e: Event) => {
        e.preventDefault();
        if (navContext?.onOpenChange) {
          navContext.onOpenChange(false);
        }
      }}
      asChild
      {...rest}
    >
      <OurLink
        ref={linkRef}
        href={href}
        color={color || isSmallScreen ? "black" : "whiteFixed"}
        data-h2-text-decoration="base(none)"
        {...(isActive && {
          "data-state": "active", // Needed for active styles
          "data-h2-color":
            "base(secondary.darker) base:dark(secondary.lightest) l-tablet:all(secondary.lighter)",
          "data-h2-text-decoration":
            "base(none) base:children[>span](none!important)", // TODO: FIX UNDERLINE WHEN ACTIVE
        })}
      >
        {children}
      </OurLink>
    </NavigationMenuPrimitive.Link>
  );
});

const Sub = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Sub>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Sub>
>((props, forwardedRef) => (
  <NavigationMenuPrimitive.Sub ref={forwardedRef} {...props} />
));

/**
 * @name NavMenu
 * @desc A collection of links for navigating websites.
 * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/navigation-menu)
 */
const NavMenu = {
  /**
   * @name Root
   * @desc An item in the group.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/navigation-menu#root)
   */
  Root,
  /**
   * @name Trigger
   * @desc The button that toggles the content.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/navigation-menu#trigger)
   */
  Trigger,
  /**
   * @name Content
   * @desc Contains the content associated with each trigger.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/navigation-menu#content)
   */
  Content,
  /**
   * @name List
   * @desc Contains the top level menu items.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/navigation-menu#list)
   */
  List,
  /**
   * @name List
   * @desc Contains the top level menu items.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/navigation-menu#list)
   */
  Viewport,
  /**
   * @name Viewport
   * @desc A top level menu item, contains a link or trigger with content combination.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/navigation-menu#item)
   */
  Item,
  /**
   * @name Link
   * @desc A navigational link.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/navigation-menu#link)
   */
  Link,
  /**
   * @name Sub
   * @desc A navigational Sub menu.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/navigation-menu#Sub)
   */
  Sub,
};

export default NavMenu;