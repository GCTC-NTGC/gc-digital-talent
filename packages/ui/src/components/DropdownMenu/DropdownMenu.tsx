/**
 * Documentation: https://www.radix-ui.com/docs/primitives/components/dropdown-menu
 */
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { forwardRef, ElementRef, ComponentPropsWithoutRef } from "react";

import { ButtonProps } from "../Button";
import getFontColor from "../../utils/button/getButtonFontColor";
import getBackgroundColor from "../../utils/button/getButtonBackgroundColor";
import getBaseStyle from "../../utils/button/getButtonBaseStyle";

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

const contentStyles = {
  "data-h2-font-family": "base(sans)",
  "data-h2-background-color": "base(foreground)",
  "data-h2-padding": "base(x.5)",
  "data-h2-radius": "base(s)",
  "data-h2-shadow": "base(s)",
};

const StyledContent = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>((props, forwardedRef) => (
  <DropdownMenuPrimitive.Content
    {...contentStyles}
    style={{ zIndex: 99 }}
    ref={forwardedRef}
    {...props}
  />
));

const StyledArrow = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Arrow>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Arrow>
>((props, forwardedRef) => (
  <DropdownMenuPrimitive.Arrow
    data-h2-fill="base(foreground)"
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
>((props, forwardedRef) => (
  <DropdownMenuPrimitive.SubContent
    {...contentStyles}
    ref={forwardedRef}
    {...props}
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

const itemStyleProps = {
  className: "DropdownMenu__Item",
  "data-h2-align-items": "base(center)",
  "data-h2-cursor": "base(pointer)",
  "data-h2-display": "base(flex)",
  "data-h2-font-weight": "base(700)",
  "data-h2-padding": "base(x.25 x1)",
  "data-h2-position": "base(relative)",
  "data-h2-radius": "base(s)",
  "data-h2-text-decoration": "base(underline)", // To match the buttons
};

type ItemProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
  color?: ButtonProps["color"];
};

const Item = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Item>,
  ItemProps
>(({ color = "secondary", disabled, ...rest }, forwardedRef) => (
  <DropdownMenuPrimitive.Item
    ref={forwardedRef}
    disabled={disabled}
    {...{
      ...getBaseStyle({ mode: "inline" }),
      ...getFontColor({ mode: "inline", color, disabled }),
      ...getBackgroundColor({ mode: "inline", color, disabled }),
    }}
    {...itemStyleProps}
    {...rest}
  />
));

type CheckboxItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.CheckboxItem
> & {
  color?: ButtonProps["color"];
};

const CheckboxItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  CheckboxItemProps
>(({ color = "secondary", ...rest }, forwardedRef) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={forwardedRef}
    {...{
      ...getBaseStyle({ mode: "inline" }),
      ...getFontColor({ mode: "inline", color }),
      ...getBackgroundColor({ mode: "inline", color }),
    }}
    {...itemStyleProps}
    {...rest}
  />
));

type RadioItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.RadioItem
> & {
  color?: ButtonProps["color"];
};

const RadioItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  RadioItemProps
>(({ color = "secondary", ...rest }, forwardedRef) => (
  <DropdownMenuPrimitive.RadioItem
    ref={forwardedRef}
    {...{
      ...getBaseStyle({ mode: "inline" }),
      ...getFontColor({ mode: "inline", color }),
      ...getBackgroundColor({ mode: "inline", color }),
    }}
    {...itemStyleProps}
    {...rest}
  />
));

const Label = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Label>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>((props, forwardedRef) => (
  <DropdownMenuPrimitive.Label
    data-h2-color="base(black)"
    ref={forwardedRef}
    {...props}
  />
));

const Separator = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>((props, forwardedRef) => (
  <DropdownMenuPrimitive.Separator
    data-h2-color="base(gray.light)"
    data-h2-margin="base(x.25, 0, x.25, 0)"
    style={{ height: 1 }}
    ref={forwardedRef}
    {...props}
  />
));

const ItemIndicator = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.ItemIndicator>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.ItemIndicator>
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
