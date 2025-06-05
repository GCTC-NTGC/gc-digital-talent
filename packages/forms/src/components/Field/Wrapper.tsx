import { DetailedHTMLProps, HtmlHTMLAttributes } from "react";
import { tv } from "tailwind-variants";

const wrapper = tv({
  base: "flex w-full flex-col gap-y-1.5",
});

export type WrapperProps = DetailedHTMLProps<
  HtmlHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const Wrapper = ({ className, ...rest }: WrapperProps) => (
  <div className={wrapper({ class: className })} {...rest} />
);

export default Wrapper;
