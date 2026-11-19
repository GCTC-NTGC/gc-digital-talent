/**
 * Documentation: https://base-ui.com/react/components/toolbar
 */
import { Toolbar as ToolbarPrimitive } from "@base-ui/react/toolbar";
import { tv } from "tailwind-variants";

const root = tv({ base: "flex flex-wrap items-center gap-x-3 gap-y-2" });

interface RootProps extends Omit<ToolbarPrimitive.Root.Props, "className"> {
  className?: string;
}

const Root = ({ className, ...rest }: RootProps) => (
  <ToolbarPrimitive.Root className={root({ class: className })} {...rest} />
);

// NOTE: Button is left unstyled on purpose, use it with
// `render={<IconButton />}` (or Button) so our own button styles apply
export default {
  Root,
  Button: ToolbarPrimitive.Button,
  Group: ToolbarPrimitive.Group,
};
