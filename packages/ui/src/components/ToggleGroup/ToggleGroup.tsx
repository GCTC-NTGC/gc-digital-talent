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
    className="hover:bg-gray-900 flex cursor-pointer items-center rounded-full bg-gray-100 p-1.5 leading-none text-black outline-none hover:bg-gray-600 hover:text-white focus-visible:bg-focus data-[state=on]:bg-warning-300 data-[state=on]:hover:bg-gray-600 data-[state=on]:focus-visible:bg-focus data-[state=on]:focus-visible:hover:bg-gray-600 [&_svg]:w-4"
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
      className="inline-flex items-center gap-x-1.5 rounded-full border border-gray-600 bg-white p-1.5 dark:border-gray-200 dark:bg-black"
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
