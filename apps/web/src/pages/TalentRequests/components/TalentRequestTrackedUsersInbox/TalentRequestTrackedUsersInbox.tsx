import type { HTMLAttributes, ReactNode } from "react";
import { tv } from "tailwind-variants";

import Row from "./Row";

const root = tv({
  base: "bg-white dark:bg-gray-600",
});

const InboxRoot = ({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) => (
  <div className={root({ class: className })} {...rest}>
    {children}
  </div>
);

const Inbox = {
  Root: InboxRoot,
  Row,
};

export default Inbox;
