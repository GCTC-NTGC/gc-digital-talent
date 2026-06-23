import type { ComponentPropsWithRef } from "react";
import { tv } from "tailwind-variants";

const toolbar = tv({
  base: "flex flex-wrap items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-700",
});

const Toolbar = ({ className, ...rest }: ComponentPropsWithRef<"div">) => (
  <div className={toolbar({ class: className })} {...rest} />
);

export default Toolbar;
