import { DetailedHTMLProps, HtmlHTMLAttributes } from "react";

export type WrapperProps = DetailedHTMLProps<
  HtmlHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const Wrapper = (props: WrapperProps) => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column)"
    data-h2-gap="base(x.25 0)"
    data-h2-max-width="base(100%)"
    {...props}
  />
);

export default Wrapper;
