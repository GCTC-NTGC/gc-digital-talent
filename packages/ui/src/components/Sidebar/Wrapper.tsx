import { HTMLProps } from "react";
import { tv } from "tailwind-variants";

type WrapperProps = HTMLProps<HTMLDivElement>;

const wrapper = tv({
  base: "mb-18 grid gap-y-6 sm:grid-cols-4 sm:gap-x-18 sm:gap-y-0",
});

const Wrapper = ({ children, className, ...rest }: WrapperProps) => (
  <div className={wrapper({ class: className })} {...rest}>
    {children}
  </div>
);

export default Wrapper;
