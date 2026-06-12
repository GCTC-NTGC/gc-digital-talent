import { type ComponentPropsWithRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { Menu } from "@base-ui/react/menu";

import IconButton, { type IconButtonProps } from "../Button/IconButton";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import IconLink, { type IconLinkProps } from "../Link/IconLink";
import {
  useSummaryItem,
  useSummaryAction,
  SummaryActionContext,
  type SummaryColor,
} from "./SummaryContext";

const action = tv({
  base: "summary-action -mt-px flex shrink-0 items-start self-stretch",
  variants: {
    justify: {
      start: "order-2",
      end: "order-4",
    },
    align: {
      start: "",
      middle: "sm:items-center",
    },
    expand: {
      true: "expanded *:after:absolute *:after:inset-0 *:after:content-['']",
    },
  },
  defaultVariants: {
    justify: "end",
    align: "middle",
  },
});

type ActionVariants = VariantProps<typeof action>;

interface ActionProps extends ComponentPropsWithRef<"div">, ActionVariants {
  color?: SummaryColor;
}

/**
 * Slot for interactive controls (buttons, links, menus) attached to a summary item.
 *
 * - `justify="start"` places the action before the content; `"end"` places it after (default).
 * - `align="middle"` centers the action vertically on wider viewports (default).
 * - `expand` stretches an `::after` pseudo-element across the entire item, making the
 *   action's first child a full-card click target (combine with `SummaryList.Item.Title`
 *   for link-style hover treatment).
 */
const Action = ({
  className,
  color: colorProp,
  justify,
  align,
  expand,
  ...rest
}: ActionProps) => {
  const { color: itemColor } = useSummaryItem();
  const color = colorProp ?? itemColor;

  return (
    <SummaryActionContext.Provider value={{ color }}>
      <div
        className={action({ align, expand, justify, class: className })}
        {...rest}
      />
    </SummaryActionContext.Provider>
  );
};

/** Icon button pre-wired to the item's color. Accepts all `IconButton` props. */
const ActionButton = ({ color: colorProp, ...rest }: IconButtonProps) => {
  const { color } = useSummaryAction();
  return <IconButton color={colorProp ?? color} {...rest} />;
};

/** Icon link pre-wired to the item's color. Accepts all `IconLink` props. */
const ActionLink = ({ color: colorProp, ...rest }: IconLinkProps) => {
  const { color } = useSummaryAction();
  return <IconLink color={colorProp ?? color} {...rest} />;
};

type ActionMenuTriggerProps = Omit<Menu.Trigger.Props, "render"> &
  IconButtonProps;

/**
 * Trigger button for `SummaryItem.Menu`. Renders an `IconButton` wired as a
 * Base UI `Menu.Trigger`. Accepts a `ref` for manual focus restoration when a
 * dialog opened from a menu item needs to return focus after close.
 */
const ActionMenuTrigger = ({
  icon,
  label,
  color: colorProp,
  size,
  disabled,
  children: _children,
  ...triggerProps
}: ActionMenuTriggerProps) => {
  const { color } = useSummaryAction();
  return (
    <Menu.Trigger
      render={
        <IconButton
          icon={icon}
          label={label}
          color={colorProp ?? color}
          size={size}
          disabled={disabled}
        />
      }
      {...triggerProps}
    />
  );
};

/**
 * Dropdown menu for summary item actions.
 *
 * `SummaryItem.Menu` is itself the root — no `.Root` needed.
 * Usage: `<SummaryItem.Menu>` → `<SummaryItem.Menu.Trigger>` → `<SummaryItem.Menu.Popup>` → `<SummaryItem.Menu.Item>`.
 *
 * When a menu item opens a dialog, store a `ref` on `Trigger` and pass it to
 * `Dialog.Content`'s `onCloseAutoFocus` — the menu item unmounts on close so
 * Radix cannot restore focus automatically. See the `WithDialogs` story for the
 * full pattern.
 */
const ActionMenu = Object.assign(DropdownMenu.Root, {
  Trigger: ActionMenuTrigger,
  Popup: DropdownMenu.Popup,
  Item: DropdownMenu.Item,
  CheckboxItem: DropdownMenu.CheckboxItem,
  RadioGroup: DropdownMenu.RadioGroup,
  RadioItem: DropdownMenu.RadioItem,
  Group: DropdownMenu.Group,
  GroupLabel: DropdownMenu.GroupLabel,
  Separator: DropdownMenu.Separator,
});

export default {
  Root: Action,
  Button: ActionButton,
  Link: ActionLink,
  Menu: ActionMenu,
};
