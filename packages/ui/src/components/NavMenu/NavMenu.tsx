/**
 * Documentation: https://www.radix-ui.com/docs/primitives/components/navigation-menu
 */
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { useLocation } from "react-router";
import {
  forwardRef,
  ComponentRef,
  ComponentPropsWithoutRef,
  useRef,
  useEffect,
} from "react";
import ChevronDownIcon from "@heroicons/react/24/solid/ChevronDownIcon";
import { tv, VariantProps } from "tailwind-variants";

import { useIsSmallScreen } from "@gc-digital-talent/helpers";

import OurLink, { LinkProps as BaseLinkProps } from "../Link/Link";
import OurIconLink, {
  IconLinkProps as BaseIconLinkProps,
} from "../Link/IconLink";
import { useNavMenuContext } from "./NavMenuProvider";
import Button, { ButtonProps } from "../Button";

const Root = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Root>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>((props, forwardedRef) => (
  <div>
    <NavigationMenuPrimitive.Root ref={forwardedRef} {...props} />
  </div>
));

type BaseHTMLProps = Omit<
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>,
  "color"
>;

interface TriggerProps extends BaseHTMLProps, ButtonProps {}

const Trigger = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Trigger>,
  TriggerProps
>(({ children, mode = "inline", color, ...rest }, forwardedRef) => (
  <NavigationMenuPrimitive.Trigger
    ref={forwardedRef}
    asChild
    onPointerMove={(event) => event.preventDefault()}
    onPointerLeave={(event) => event.preventDefault()}
    className="w-full px-3 py-2 text-left font-normal hover:text-primary-600 sm:py-4.5 sm:hover:text-primary-200 dark:hover:text-primary-100 [&_svg]:mt-0! [&_svg]:size-4.5! [&_svg]:transform [&_svg]:transition-transform [&_svg]:duration-200 data-[state=closed]:[&_svg]:rotate-0 data-[state=open]:[&_svg]:rotate-180"
    {...rest}
  >
    <Button utilityIcon={ChevronDownIcon} mode={mode} color={color} noUnderline>
      {children}
    </Button>
  </NavigationMenuPrimitive.Trigger>
));

const content = tv({
  base: "top-full sm:absolute sm:left-1/2 sm:z-20 sm:min-w-3xs sm:-translate-x-1/2 sm:rounded sm:bg-white sm:p-1.5 sm:shadow-lg dark:sm:bg-gray-600",
});

const Content = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...rest }, forwardedRef) => (
  <NavigationMenuPrimitive.Content
    ref={forwardedRef}
    onPointerMove={(event) => event.preventDefault()}
    onPointerLeave={(event) => event.preventDefault()}
    className={content({ class: className })}
    {...rest}
  />
));

const Viewport = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Viewport>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>((props, forwardedRef) => (
  <div>
    <NavigationMenuPrimitive.Viewport ref={forwardedRef} {...props} />
  </div>
));

const list = tv({
  base: "m-0 flex list-none flex-col p-0",
  variants: {
    type: {
      main: "sm:flex-row sm:items-center",
    },
  },
});

type ListVariants = VariantProps<typeof list>;

interface ListProps
  extends
    ListVariants,
    ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List> {}

const List = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.List>,
  ListProps
>(({ children, className, type, ...rest }, forwardedRef) => (
  <NavigationMenuPrimitive.List
    ref={forwardedRef}
    className={list({ type, class: className })}
    {...rest}
  >
    {children}
  </NavigationMenuPrimitive.List>
));

const Item = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Item>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>
>((props, forwardedRef) => (
  <NavigationMenuPrimitive.Item
    ref={forwardedRef}
    {...props}
    className={`w-full sm:relative sm:w-auto data-[state=active]:[&_span]:font-bold! data-[state=active]:[&_span]:no-underline! ${props.className}`}
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

const navMenuLink = tv({
  base: "items-center font-normal text-black hover:text-primary-200 focus-visible:text-black data-active:font-bold data-active:text-primary-200 data-active:hover:text-primary data-active:focus-visible:text-black hover:data-icon:text-primary-700 dark:text-white dark:hover:text-primary-100 dark:data-active:text-primary-200 dark:data-active:hover:text-primary-200 dark:hover:data-icon:text-primary-700 iap:data-active:hover:text-primary-600 data-active:[&_span]:no-underline",
  variants: {
    isSmallScreen: {
      true: "",
      false: "",
    },
    isIcon: {
      true: "",
      false: "flex px-3 py-2 sm:py-4.5",
    },
    type: {
      link: "",
      subMenuLink:
        "hover:text-primary-600 data-active:text-primary-600 data-active:hover:text-primary-700 data-active:dark:text-primary-200 data-active:dark:hover:text-primary-100",
    },
  },
  defaultVariants: {
    isIcon: false,
  },
  compoundVariants: [
    {
      isSmallScreen: false,
      type: "link",
      class:
        "data-active text-white data-active:text-primary-200 hover:data-icon:text-primary-700 dark:data-active:text-primary-100 dark:hover:data-icon:text-primary-700",
    },
    {
      type: "subMenuLink",
      isIcon: false,
      class: "py-1.5 pr-1.5 pl-6 sm:px-3 sm:py-3",
    },
  ],
});

type NavMenuLinkTypeVariant = Pick<VariantProps<typeof navMenuLink>, "type">;

interface IconLinkProps
  extends
    NavMenuLinkTypeVariant,
    Omit<
      ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>,
      "type" | "color" | "href"
    >,
    Pick<BaseIconLinkProps, "href" | "icon" | "color" | "label"> {}

const IconLink = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Link>,
  IconLinkProps
>(({ children, type = "link", icon, href, ...rest }, forwardedRef) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const { isActive } = useActiveLink(href, !!icon, linkRef.current);
  const isSmallScreen = useIsSmallScreen("sm");
  const navContext = useNavMenuContext();

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
        className={navMenuLink({
          isIcon: true,
          isSmallScreen,
          type,
        })}
        data-icon
      />
    </NavigationMenuPrimitive.Link>
  );
});

interface LinkProps
  extends
    NavMenuLinkTypeVariant,
    Pick<BaseLinkProps, "color" | "icon" | "mode" | "href" | "end">,
    Omit<
      ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>,
      "color" | "href" | "type"
    > {
  ariaLabel?: string;
  state?: BaseLinkProps["state"];
}

const Link = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Link>,
  LinkProps
>(
  (
    {
      children,
      href,
      type = "link",
      color,
      icon,
      mode = "inline",
      ariaLabel,
      state,
      ...rest
    },
    forwardedRef,
  ) => {
    const linkRef = useRef<HTMLAnchorElement>(null);
    const { isActive } = useActiveLink(href, !!icon, linkRef.current);
    const isSmallScreen = useIsSmallScreen("sm");
    const navContext = useNavMenuContext();

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
          className={navMenuLink({
            isIcon: false,
            isSmallScreen,
            type,
          })}
          aria-label={ariaLabel}
        >
          {children}
        </OurLink>
      </NavigationMenuPrimitive.Link>
    );
  },
);

const Sub = forwardRef<
  ComponentRef<typeof NavigationMenuPrimitive.Sub>,
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
