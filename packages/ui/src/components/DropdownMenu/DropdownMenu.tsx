/**
 * Documentation: https://www.radix-ui.com/docs/primitives/components/dropdown-menu
 */
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { tv, VariantProps } from "tailwind-variants";
import { forwardRef, ElementRef, ComponentPropsWithoutRef } from "react";

const Trigger = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>
>(({ asChild = true, ...rest }, forwardedRef) => (
  <DropdownMenuPrimitive.Trigger
    ref={forwardedRef}
    asChild={asChild}
    {...rest}
  />
));

const content = tv({
  base: "rounded bg-white p-3 font-sans text-black shadow-md dark:bg-gray-600 dark:text-white",
});

const StyledContent = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, ...rest }, forwardedRef) => (
  <DropdownMenuPrimitive.Content
    className={content({ class: ["z-[9999]", className] })}
    ref={forwardedRef}
    {...rest}
  />
));

const StyledArrow = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Arrow>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Arrow>
>((props, forwardedRef) => (
  <DropdownMenuPrimitive.Arrow
    className="fill-white dark:fill-gray-600"
    ref={forwardedRef}
    {...props}
  />
));

type DropdownMenuPrimitiveContentProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Content
>;
const Content = ({ children, ...props }: DropdownMenuPrimitiveContentProps) => (
  <DropdownMenuPrimitive.Portal>
    <StyledContent {...props}>
      {children}
      <StyledArrow />
    </StyledContent>
  </DropdownMenuPrimitive.Portal>
);

const StyledSubContent = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...rest }, forwardedRef) => (
  <DropdownMenuPrimitive.SubContent
    className={content({ class: className })}
    ref={forwardedRef}
    {...rest}
  />
));

type DropdownMenuPrimitiveSubContentProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.SubContent
>;
const SubContent = ({
  children,
  ...props
}: DropdownMenuPrimitiveSubContentProps) => (
  <DropdownMenuPrimitive.Portal>
    <StyledSubContent {...props}>{children}</StyledSubContent>
  </DropdownMenuPrimitive.Portal>
);

const item = tv({
  base: "transition-200 ease flex cursor-pointer items-center rounded bg-transparent px-6 py-1.5 font-bold underline transition outline-none focus-visible:bg-focus hover:focus-visible:text-black",
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

interface ItemProps
  extends ItemVariants,
    Omit<
      ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>,
      "color"
    > {}

const Item = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Item>,
  ItemProps
>(({ color = "primary", disabled, className, ...rest }, forwardedRef) => (
  <DropdownMenuPrimitive.Item
    ref={forwardedRef}
    disabled={disabled}
    className={item({ color, disabled, class: className })}
    {...rest}
  />
));

interface CheckboxItemProps
  extends ItemVariants,
    Omit<
      ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>,
      "color"
    > {}

const CheckboxItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  CheckboxItemProps
>(({ color = "primary", className, ...rest }, forwardedRef) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={forwardedRef}
    className={item({ color, class: className })}
    {...rest}
  />
));

interface RadioItemProps
  extends ItemVariants,
    Omit<
      ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>,
      "color"
    > {}

const RadioItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  RadioItemProps
>(({ color = "primary", className, ...rest }, forwardedRef) => (
  <DropdownMenuPrimitive.RadioItem
    ref={forwardedRef}
    className={item({ color, class: className })}
    {...rest}
  />
));

const Label = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Label>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>((props, forwardedRef) => (
  <DropdownMenuPrimitive.Label
    className="text-black dark:text-white"
    ref={forwardedRef}
    {...props}
  />
));

const Separator = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>((props, forwardedRef) => (
  <DropdownMenuPrimitive.Separator
    className="my-1.5 h-px text-gray-100/10"
    ref={forwardedRef}
    {...props}
  />
));

const ItemIndicator = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.ItemIndicator>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.ItemIndicator>
>((props, forwardedRef) => (
  <DropdownMenuPrimitive.ItemIndicator
    className="absolute left-0 inline-flex h-px w-1.5 items-center justify-center"
    ref={forwardedRef}
    {...props}
  />
));

const { Root, RadioGroup, Group } = DropdownMenuPrimitive;

/**
 * @name DropdownMenu
 * @desc Displays a menu to the user—such as a set of actions or functions—triggered by a button.
 * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/dropdown-menu)
 */
const DropdownMenu = {
  /**
   * @name Root
   * @desc Contains all the parts of a dropdown menu.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/dropdown-menu#root)
   */
  Root,
  /**
   * @name Trigger
   * @desc The button that toggles the dropdown menu.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/dropdown-menu#trigger)
   */
  Trigger,
  /**
   * @name Content
   * @desc The component that pops out when the dropdown menu is open.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/dropdown-menu#content)
   */
  Content,
  SubContent,
  /**
   * @name Item
   * @desc The component that contains the dropdown menu items.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/dropdown-menu#item)
   */
  Item,
  /**
   * @name ItemIndicator
   * @desc Renders when the parent `DropdownMenu.CheckboxItem` or `DropdownMenu.RadioItem` is checked.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/dropdown-menu#itemindicator)
   */
  ItemIndicator,
  /**
   * @name RadioGroup
   * @desc Used to group multiple `DropdownMenu.RadioItem`s.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/dropdown-menu#radiogroup)
   */
  RadioGroup,
  /**
   * @name CheckboxItem
   * @desc An item that can be controlled and rendered like a checkbox.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/dropdown-menu#checkboxitem)
   */
  CheckboxItem,
  /**
   * @name RadioItem
   * @desc An item that can be controlled and rendered like a radio.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/dropdown-menu#radioitem)
   */
  RadioItem,
  /**
   * @name Label
   * @desc Used to render a label. It won't be focusable using arrow keys.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/dropdown-menu#label)
   */
  Label,
  /**
   * @name Group
   * @desc Used to group multiple DropdownMenu.Items.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/dropdown-menu#group)
   */
  Group,
  /**
   * @name Separator
   * @desc Used to visually separate items in the dropdown menu.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/dropdown-menu#separator)
   */
  Separator,
};

export default DropdownMenu;
