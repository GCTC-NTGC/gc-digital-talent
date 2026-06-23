import type { ComponentPropsWithRef } from "react";
import { tv } from "tailwind-variants";

const actions = tv({
  base: "flex flex-wrap items-center gap-3 border-b border-gray-200 px-4 py-2 dark:border-gray-700",
});

const Actions = ({ className, ...rest }: ComponentPropsWithRef<"div">) => (
  <div className={actions({ class: className })} {...rest} />
);

export default Actions;
