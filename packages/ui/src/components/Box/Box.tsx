import type { ElementType, ComponentPropsWithRef, ReactNode } from "react";

type BoxProps<T extends ElementType> = {
  as?: T;
  children?: ReactNode;
} & Omit<ComponentPropsWithRef<T>, "as" | "children">;

function Box<T extends ElementType = "div">({
  as,
  children,
  ref,
  ...props
}: BoxProps<T>) {
  const Component = as ?? "div";

  return (
    <Component {...props} ref={ref}>
      {children}
    </Component>
  );
}

export default Box;
