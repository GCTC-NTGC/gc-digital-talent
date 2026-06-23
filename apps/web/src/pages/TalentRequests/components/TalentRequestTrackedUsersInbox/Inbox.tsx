import type { HTMLAttributes, ReactNode } from "react";
import { tv } from "tailwind-variants";

import Actions from "./Actions";
import Row from "./Row";
import Toolbar from "./Toolbar";

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
  Toolbar,
  Actions,
  Row,
};

export default Inbox;
