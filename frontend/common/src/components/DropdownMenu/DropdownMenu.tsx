/**
 * Documentation: https://www.radix-ui.com/docs/primitives/components/dropdown-menu
 */
import React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

const Trigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>
>(({ asChild = true, ...rest }, forwardedRef) => (
  <DropdownMenuPrimitive.Trigger
    ref={forwardedRef}
    asChild={asChild}
    {...rest}
  />
));

const contentStyles = {
  "data-h2-font-family": "base(sans)",
  "data-h2-background-color": "base(dt-white)",
  "data-h2-padding": "base(x.5)",
  "data-h2-radius": "base(s)",
  "data-h2-shadow": "base(s)",
};

const StyledContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>((props, forwardedRef) => (
  <DropdownMenuPrimitive.Content
    {...contentStyles}
    style={{ zIndex: 99 }}
    ref={forwardedRef}
    {...props}
  />
));

const StyledArrow = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Arrow>
>((props, forwardedRef) => (
  <DropdownMenuPrimitive.Arrow
    style={{ fill: `rgba(var(--h2-color-dt-white), 1)` }}
    ref={forwardedRef}
    {...props}
  />
));

type DropdownMenuPrimitiveContentProps = React.ComponentPropsWithoutRef<
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

const StyledSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>((props, forwardedRef) => (
  <DropdownMenuPrimitive.SubContent
    {...contentStyles}
    ref={forwardedRef}
    {...props}
  />
));

type DropdownMenuPrimitiveSubContentProps = React.ComponentPropsWithoutRef<
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

const itemStyleProps = {
  className: "DropdownMenu__Item",
  style: {
    fontSize: "0.85rem",
  },
  "data-h2-align-items": "base(center)",
  "data-h2-background-color": "base(transparent) base:hover(dt-secondary.15)",
  "data-h2-color":
    "base(dt-secondary.dark) base:selectors[[data-disabled]](dt-gray)",
  "data-h2-cursor": "base(pointer)",
  "data-h2-display": "base(flex)",
  "data-h2-padding": "base(x.25, x.5, x.25, x1)",
  "data-h2-position": "base(relative)",
  "data-h2-radius": "base(s)",
};

const Item = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>((props, forwardedRef) => (
  <DropdownMenuPrimitive.Item
    {...itemStyleProps}
    ref={forwardedRef}
    {...props}
  />
));

const CheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>((props, forwardedRef) => (
  <DropdownMenuPrimitive.CheckboxItem
    {...itemStyleProps}
    ref={forwardedRef}
    {...props}
  />
));

const RadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>((props, forwardedRef) => (
  <DropdownMenuPrimitive.RadioItem
    {...itemStyleProps}
    ref={forwardedRef}
    {...props}
  />
));

const Label = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>((props, forwardedRef) => (
  <DropdownMenuPrimitive.Label
    data-h2-color="base(dt-gray)"
    ref={forwardedRef}
    {...props}
  />
));

const Separator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>((props, forwardedRef) => (
  <DropdownMenuPrimitive.Separator
    data-h2-color="base(dt-gray)"
    data-h2-margin="base(x.25, 0, x.25, 0)"
    style={{ height: 1 }}
    ref={forwardedRef}
    {...props}
  />
));

const ItemIndicator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.ItemIndicator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.ItemIndicator>
>((props, forwardedRef) => (
  <DropdownMenuPrimitive.ItemIndicator
    data-h2-align-items="base(center)"
    data-h2-display="base(inline-flex)"
    data-h2-justify-content="base(center)"
    data-h2-location="base(auto, auto, auto, 0)"
    data-h2-position="base(absolute)"
    data-h2-width="base(x1)"
    data-h2-padding="base(x.25)"
    style={{ height: 1 }}
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
