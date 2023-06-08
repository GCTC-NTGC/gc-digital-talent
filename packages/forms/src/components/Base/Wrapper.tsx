import React from "react";

type WrapperProps = React.DetailedHTMLProps<
  React.HtmlHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  as?: React.ElementType;
};

const Wrapper = ({ as, ...rest }: WrapperProps) => {
  const El = as || "div";
  return (
    <El
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x.25 0)"
      {...rest}
    />
  );
};

export default Wrapper;
