import { ReactNode } from "react";
import { tv } from "tailwind-variants";

interface ContentProps {
  children?: ReactNode;
  className?: string;
}

const content = tv({
  base: "col-span-3",
});

const Content = ({ children, className }: ContentProps) => (
  <div className={content({ class: className })}>{children}</div>
);

export default Content;
