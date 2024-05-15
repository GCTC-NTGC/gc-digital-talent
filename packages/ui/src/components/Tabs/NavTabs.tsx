/**
 * This is different from tabs in that
 * it contains a `nav` element with `a` tags
 * and applies the appropriate `aria` attributes
 *
 * Documentation: https://www.radix-ui.com/docs/primitives/components/navigation-menu
 */
import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { Link as RouterLink, useLocation } from "react-router-dom";

import { commonTabStyles, handleTabFocus } from "./utils";

const Root = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>((props, forwardedRef) => (
  <div {...commonTabStyles.root}>
    <NavigationMenuPrimitive.Root ref={forwardedRef} {...props} />
    <div {...commonTabStyles.contentDivide} />
  </div>
));

const List = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ children, ...rest }, forwardedRef) => (
  <NavigationMenuPrimitive.List
    ref={forwardedRef}
    className="Tabs__List Tabs__List--nav"
    {...commonTabStyles.list}
    {...rest}
  >
    {children}
  </NavigationMenuPrimitive.List>
));

const Item = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>
>((props, forwardedRef) => (
  <NavigationMenuPrimitive.Item
    ref={forwardedRef}
    {...commonTabStyles.trigger}
    {...props}
  />
));

type LinkProps = React.ComponentPropsWithoutRef<
  typeof NavigationMenuPrimitive.Link
> & {
  href: string;
};

const Link = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Link>,
  LinkProps
>(({ children, href, ...rest }, forwardedRef) => {
  const { pathname } = useLocation();
  const linkRef = React.useRef<HTMLAnchorElement>(null);

  const isActive = pathname === href;

  React.useEffect(() => {
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
      asChild
      {...rest}
    >
      <RouterLink
        to={href}
        ref={linkRef}
        onFocus={handleTabFocus}
        {...(isActive && {
          "data-state": "active", // Needed for active styles (mirrors tabs)
        })}
        {...commonTabStyles.triggerInner}
      >
        {children}
      </RouterLink>
    </NavigationMenuPrimitive.Link>
  );
});

/**
 * @name NavTabs
 * @desc A collection of links for navigating websites.
 * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/navigation-menu)
 */
const NavTabs = {
  /**
   * @name Root
   * @desc An item in the group.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/navigation-menu#root)
   */
  Root,
  /**
   * @name List
   * @desc Contains the top level menu items.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/navigation-menu#list)
   */
  List,
  /**
   * @name Item
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
};

export default NavTabs;
