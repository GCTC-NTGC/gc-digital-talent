/**
 * Documentation: https://www.radix-ui.com/docs/primitives/components/navigation-menu
 */
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { useLocation } from "react-router";
import {
  forwardRef,
  ElementRef,
  ComponentPropsWithoutRef,
  useRef,
  useEffect,
} from "react";
import ChevronDownIcon from "@heroicons/react/24/solid/ChevronDownIcon";

import { useIsSmallScreen } from "@gc-digital-talent/helpers";

import OurLink, { LinkProps as BaseLinkProps } from "../Link/Link";
import OurIconLink, {
  IconLinkProps as BaseIconLinkProps,
} from "../Link/IconLink";
import { ButtonLinkMode, Color, IconType } from "../../types";
import { useNavMenuContext } from "./NavMenuProvider";
import { linkStyleMapDesktop, linkStyleMapMobile, NavMenuType } from "./utils";
import Button, { ButtonProps } from "../Button";

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
  ButtonProps;

const Trigger = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  TriggerProps
>(({ children, mode, color, block = false, ...rest }, forwardedRef) => (
  <div className="text-center sm:text-left">
    <NavigationMenuPrimitive.Trigger
      ref={forwardedRef}
      asChild
      onPointerMove={(event) => event.preventDefault()}
      onPointerLeave={(event) => event.preventDefault()}
      className="[&_svg]:mt-0! [&_svg]:size-4.5! [&_svg]:transform [&_svg]:transition-transform [&_svg]:duration-200 data-[state=closed]:[&_svg]:rotate-0 data-[state=open]:[&_svg]:rotate-180"
      {...rest}
    >
      <Button
        utilityIcon={ChevronDownIcon}
        mode={mode}
        color={color}
        block={block}
      >
        {children}
      </Button>
    </NavigationMenuPrimitive.Trigger>
  </div>
));

const Content = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>((props, forwardedRef) => (
  <NavigationMenuPrimitive.Content
    ref={forwardedRef}
    onPointerMove={(event) => event.preventDefault()}
    onPointerLeave={(event) => event.preventDefault()}
    className="mt-6 sm:absolute sm:-left-1/4 sm:mt-0 sm:w-[150%] sm:rounded sm:bg-white sm:px-3 sm:py-1.5 sm:shadow dark:sm:bg-gray-600"
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
    className="m-0 flex list-none flex-col items-center gap-4.5 p-0 sm:items-start"
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
    className="sm:relative data-[state=active]:[&_span]:font-bold! data-[state=active]:[&_span]:no-underline!"
    {...props}
  />
));

const useActiveLink = (
  href: BaseLinkProps["href"],
  hasIcon?: boolean,
  el?: HTMLAnchorElement | null,
): { isActive: boolean } => {
  const { pathname } = useLocation();
  const linkRef = useRef<HTMLAnchorElement>(null);

  const isActive = pathname === href;

  useEffect(() => {
    if (el) {
      el.parentElement?.setAttribute(
        "data-state",
        isActive ? "active" : "inactive",
      );
      linkRef.current?.setAttribute("data-icon", hasIcon ? "true" : "false");
    }
  }, [isActive, hasIcon, el]);

  return { isActive };
};

type IconLinkProps = ComponentPropsWithoutRef<
  typeof NavigationMenuPrimitive.Link
> &
  BaseIconLinkProps & {
    type?: NavMenuType;
  };

const IconLink = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Link>,
  IconLinkProps
>(({ children, type = "link", icon, href, ...rest }, forwardedRef) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const { isActive } = useActiveLink(href, !!icon, linkRef.current);
  const isSmallScreen = useIsSmallScreen(1080);
  const navContext = useNavMenuContext();
  const linkColor = isSmallScreen
    ? linkStyleMapMobile.get(type)
    : linkStyleMapDesktop.get(type);

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
      <OurIconLink
        ref={linkRef}
        href={href}
        icon={icon}
        className="data-active:font-bold data-active:[&_span]:no-underline"
        {...linkColor}
        {...rest}
      />
    </NavigationMenuPrimitive.Link>
  );
});

type LinkProps = ComponentPropsWithoutRef<
  typeof NavigationMenuPrimitive.Link
> & {
  href: string;
  type?: NavMenuType;
  color?: Color;
  icon?: IconType;
  mode?: ButtonLinkMode;
  ariaLabel?: string;
  state?: BaseLinkProps["state"];
};

const Link = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Link>,
  LinkProps
>(
  (
    {
      children,
      href,
      type = "link",
      color,
      icon,
      mode,
      ariaLabel,
      state,
      ...rest
    },
    forwardedRef,
  ) => {
    const linkRef = useRef<HTMLAnchorElement>(null);
    const { isActive } = useActiveLink(href, !!icon, linkRef.current);
    const isSmallScreen = useIsSmallScreen(1080);
    const navContext = useNavMenuContext();

    const linkColor = isSmallScreen
      ? linkStyleMapMobile.get(type)
      : linkStyleMapDesktop.get(type);

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
          icon={icon}
          mode={mode}
          // Comes from react-router
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          state={state}
          className="data-active:font-bold data-active:[&_span]:no-underline"
          {...linkColor}
          aria-label={ariaLabel}
        >
          {children}
        </OurLink>
      </NavigationMenuPrimitive.Link>
    );
  },
);

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
  IconLink,
  /**
   * @name Sub
   * @desc A navigational Sub menu.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/navigation-menu#Sub)
   */
  Sub,
};

export default NavMenu;
