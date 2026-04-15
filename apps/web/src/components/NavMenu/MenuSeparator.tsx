import { tv } from "tailwind-variants";

import type { SeparatorProps } from "@gc-digital-talent/ui";
import { Separator } from "@gc-digital-talent/ui";

const separator = tv({
  base: "bg-black/20 dark:bg-white/20",
  variants: {
    vertical: {
      true: "hidden h-6 sm:block",
      false: "sm:hidden",
    },
  },
});

const MenuSeparator = ({ className, orientation }: SeparatorProps) => (
  <Separator
    decorative
    space="xs"
    orientation={orientation}
    className={separator({
      class: className,
      vertical: orientation === "vertical",
    })}
  />
);

export default MenuSeparator;
