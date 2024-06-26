/**
 * Documentation: https://www.radix-ui.com/docs/primitives/components/toggle-group
 */
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import {
  forwardRef,
  ElementRef,
  ComponentPropsWithoutRef,
  ReactNode,
} from "react";

const Item = forwardRef<
  ElementRef<typeof ToggleGroupPrimitive.Item>,
  ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>((props, forwardedRef) => (
  <ToggleGroupPrimitive.Item
    data-h2-align-items="base(center)"
    data-h2-cursor="base:hover(pointer)"
    data-h2-display="base(flex)"
    data-h2-line-height="base(1)"
    data-h2-outline="base(none)"
    data-h2-padding="base(x.25)"
    data-h2-radius="base(m)"
    data-h2-width="base:children[svg](x.75)"
    ref={forwardedRef}
    {...props}
  />
));

type RootProps = ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & {
  label?: ReactNode;
};

const Root = forwardRef<
  ElementRef<typeof ToggleGroupPrimitive.Root>,
  RootProps
>(({ label, children, ...rest }, forwardedRef) => {
  return (
    <ToggleGroupPrimitive.Root
      data-h2-align-items="base(center)"
      data-h2-background-color="
        base(foreground) base:dark(white)
        base:children[button](background.dark)
        base:children[button:hover](background.darkest)
        base:children[button:focus-visible](focus)
        base:all:children[button[data-state='on']](quaternary.light)
      "
      data-h2-color="
        base(black)
        base:children[button](black)
        base:iap:children[button](black)
        base:children[button:hover](white)
        base:all:children[button:focus-visible](black)
        base:all:children[button[data-state='on']](black)
        base:iap:all:children[button[data-state='on']](white)
        base:iap:children[button:hover[data-state='on']](white)
      "
      data-h2-border="base(1px solid background.darker)"
      data-h2-display="base(inline-flex)"
      data-h2-padding="base(x.25)"
      data-h2-radius="base(m)"
      data-h2-gap="base(0, x.25)"
      ref={forwardedRef}
      {...rest}
    >
      {label && <div>{label}</div>}
      {children}
    </ToggleGroupPrimitive.Root>
  );
});

/**
 * @name Toggle Group
 * @desc A set of two-state buttons that can be toggled on or off.
 * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/toggle-group)
 */
const ToggleGroup = {
  /**
   * @name Root
   * @desc Contains all the parts of a toggle group.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/toggle-group#root)
   */
  Root,
  /**
   * @name Item
   * @desc An item in the group.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/toggle-group#item)
   */
  Item,
};

export default ToggleGroup;
