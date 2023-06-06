import React from "react";
import useCommonInputStyles from "../../hooks/useCommonInputStyles";

type ErrorProps = React.DetailedHTMLProps<
  React.HtmlHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const Error = (props: ErrorProps) => {
  const styles = useCommonInputStyles();

  return (
    <div
      data-h2-background-color="base(error.lightest)"
      data-h2-border-color="base(error.darker)"
      data-h2-color="base(error.darker)"
      {...styles}
      {...props}
    />
  );
};

export default Error;
