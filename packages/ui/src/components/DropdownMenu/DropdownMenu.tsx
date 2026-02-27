/**
 * Documentation: https://base-ui.com/react/components/menu
 */
import { Menu } from "@base-ui/react/menu";
import { tv, VariantProps } from "tailwind-variants";
import ChevronDownIcon from "@heroicons/react/16/solid/ChevronDownIcon";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";

import Button, { ButtonProps } from "../Button";

interface TriggerProps extends Menu.Trigger.Props {
  btnProps?: ButtonProps;
}

const Trigger = ({ btnProps, render, ...triggerProps }: TriggerProps) => (
  <Menu.Trigger
    render={render ?? <Button utilityIcon={ChevronDownIcon} {...btnProps} />}
    {...triggerProps}
  />
);

function ArrowSvg(props: React.ComponentProps<"svg">) {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
        className="fill-white dark:fill-gray-600"
      />
      <path
        d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
        className="fill-gray-200 dark:fill-none"
      />
      <path
        d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
        className="dark:fill-gray-300"
      />
    </svg>
  );
}

const popup = tv({
  base: `max-h-[var(--available-height)] max-w-screen overflow-y-auto rounded-md bg-white py-3 font-sans text-black shadow-md outline-1 outline-gray-200 dark:bg-gray-600 dark:text-white dark:-outline-offset-1 dark:outline-gray-300`,
});

interface PopupProps extends Omit<Menu.Popup.Props, "className"> {
  portalProps?: Menu.Portal.Props;
  positionerProps?: Menu.Positioner.Props;
  className?: string;
}

const Popup = ({
  portalProps,
  positionerProps,
  children,
  className,
  ref,
  ...popupProps
}: PopupProps) => (
  <Menu.Portal {...portalProps}>
    <Menu.Positioner
      className="max-w-(--available-height)"
      sideOffset={8}
      {...positionerProps}
    >
      <Menu.Popup
        ref={ref}
        className={popup({ class: className })}
        {...popupProps}
      >
        <Menu.Arrow className="data-[side=bottom]:-top-2 data-[side=left]:-right-3.25 data-[side=left]:rotate-90 data-[side=right]:-left-3.25 data-[side=right]:-rotate-90 data-[side=top]:-bottom-1.75 data-[side=top]:rotate-180 md:data-[side=bottom]:-top-1.75">
          <ArrowSvg />
        </Menu.Arrow>
        {children}
      </Menu.Popup>
    </Menu.Positioner>
  </Menu.Portal>
);

const item = tv({
  base: "transition-200 ease flex cursor-pointer items-center rounded-md bg-transparent px-6 py-1.5 font-bold underline transition outline-none focus-visible:bg-focus hover:focus-visible:text-black",
  variants: {
    color: {
      primary:
        "text-primary-600 hover:text-primary-700 focus-visible:bg-focus focus-visible:text-black dark:text-primary-200 dark:hover:text-primary-300",
      secondary:
        "text-secondary-600 hover:text-secondary-700 focus-visible:bg-focus focus-visible:text-black dark:text-secondary-200 dark:hover:text-secondary-300",
      success:
        "text-success-600 hover:text-success-700 focus-visible:bg-focus focus-visible:text-black dark:text-success-200 dark:hover:text-success-300",
      warning:
        "text-warning-600 hover:text-warning-700 focus-visible:bg-focus focus-visible:text-black dark:text-warning-200 dark:hover:text-warning-300",
      error:
        "text-error-600 hover:text-error-700 focus-visible:bg-focus focus-visible:text-black dark:text-error-100 dark:hover:text-error-300",
      black:
        "hover:text-gray-900 text-black focus-visible:text-black dark:text-gray-100 dark:hover:text-gray-200",
    },
    disabled: {
      true: "text-gray-600 focus-visible:text-black dark:text-gray-200",
    },
  },
});

type ItemVariants = VariantProps<typeof item>;

interface ItemProps extends ItemVariants, Omit<Menu.Item.Props, "className"> {
  className?: string;
}

const Item = ({
  className,
  color = "primary",
  disabled,
  ...rest
}: ItemProps) => (
  <Menu.Item
    disabled={disabled}
    className={item({ color, disabled, class: className })}
    {...rest}
  />
);

const checkboxItem = tv({
  extend: item,
  base: "grid grid-cols-[0.75rem_1fr] items-center gap-2 pl-3",
});

interface CheckboxItemProps
  extends Omit<Menu.CheckboxItem.Props, "className">, ItemVariants {
  className?: string;
}

const CheckboxItem = ({
  color = "primary",
  disabled,
  className,
  children,
  ...rest
}: CheckboxItemProps) => (
  <Menu.CheckboxItem
    className={checkboxItem({ color, disabled, class: className })}
    {...rest}
  >
    <Menu.CheckboxItemIndicator className="col-start-1">
      <CheckIcon className="size-4" />
    </Menu.CheckboxItemIndicator>
    <span className="col-start-2">{children}</span>
  </Menu.CheckboxItem>
);

interface RadioItemProps
  extends Omit<Menu.RadioItem.Props, "className">, ItemVariants {
  className?: string;
}

const RadioItem = ({
  color = "primary",
  disabled,
  className,
  children,
  ...rest
}: RadioItemProps) => (
  <Menu.RadioItem
    className={checkboxItem({ color, disabled, class: className })}
    {...rest}
  >
    <Menu.RadioItemIndicator className="col-start-1">
      <CheckIcon className="size-4" />
    </Menu.RadioItemIndicator>
    <span className="col-start-2">{children}</span>
  </Menu.RadioItem>
);

const groupLabel = tv({ base: "px-3 py-1.5" });

interface GroupLabelProps extends Omit<Menu.GroupLabel.Props, "className"> {
  className?: string;
}

const GroupLabel = ({ className, ...rest }: GroupLabelProps) => (
  <Menu.GroupLabel className={groupLabel({ class: className })} {...rest} />
);

const separator = tv({ base: "my-1.5 h-px bg-gray-100/10" });

interface SeparatorProps extends Omit<Menu.Separator.Props, "className"> {
  className?: string;
}

const Separator = ({ className, ...rest }: SeparatorProps) => (
  <Menu.Separator className={separator({ class: className })} {...rest} />
);

export default {
  Root: Menu.Root,
  Trigger,
  Popup,
  Item,
  CheckboxItem,
  RadioGroup: Menu.RadioGroup,
  RadioItem,
  Group: Menu.Group,
  GroupLabel,
  Separator,
};
