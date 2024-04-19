import React from "react";

export type WrapperProps = React.DetailedHTMLProps<
  React.HtmlHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const Wrapper = (props: WrapperProps) => (
  <div
    className="flex"
    data-h2-flex-direction="base(column)"
    data-h2-gap="base(x.25 0)"
    data-h2-max-width="base(100%)"
    {...props}
  />
);

export default Wrapper;
