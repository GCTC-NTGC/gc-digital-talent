import { type ComponentPropsWithRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { Menu } from "@base-ui/react/menu";

import IconButton, { type IconButtonProps } from "../Button/IconButton";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import IconLink, { type IconLinkProps } from "../Link/IconLink";
import {
  useSummaryItem,
  SummaryActionContext,
  useSummaryAction,
} from "./SummaryContext";
import type { SummaryColor } from "./SummaryContext";

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

const ActionButton = ({ color: colorProp, ...rest }: IconButtonProps) => {
  const { color } = useSummaryAction();
  return <IconButton color={colorProp ?? color} {...rest} />;
};

const ActionLink = ({ color: colorProp, ...rest }: IconLinkProps) => {
  const { color } = useSummaryAction();
  return <IconLink color={colorProp ?? color} {...rest} />;
};

type ActionMenuTriggerProps = Omit<Menu.Trigger.Props, "render"> &
  IconButtonProps;

const ActionMenuTrigger = ({
  icon,
  label,
  color: colorProp,
  size,
  disabled,
  children,
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

const ActionMenu = {
  Root: DropdownMenu.Root,
  Trigger: ActionMenuTrigger,
  Popup: DropdownMenu.Popup,
  Item: DropdownMenu.Item,
  CheckboxItem: DropdownMenu.CheckboxItem,
  RadioGroup: DropdownMenu.RadioGroup,
  RadioItem: DropdownMenu.RadioItem,
  Group: DropdownMenu.Group,
  GroupLabel: DropdownMenu.GroupLabel,
  Separator: DropdownMenu.Separator,
};

export default {
  Root: Action,
  Button: ActionButton,
  Link: ActionLink,
  Menu: ActionMenu,
};
