import React from "react";

type WrapperProps = React.DetailedHTMLProps<
  React.HtmlHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const Wrapper = (props: WrapperProps) => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column)"
    data-h2-gap="base(x.25 0)"
    {...props}
  />
);

export default Wrapper;
