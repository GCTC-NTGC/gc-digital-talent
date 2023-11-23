import React from "react";

import useCommonInputStyles from "../../hooks/useCommonInputStyles";

type BoundingBoxProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  flat?: boolean;
};

const BoundingBox = ({ flat, ...rest }: BoundingBoxProps) => {
  const styles = useCommonInputStyles();

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x.25 0)"
      data-h2-margin-top="base(x.25)"
      {...styles}
      {...(flat
        ? {
            "data-h2-border-color": "base(transparent)",
            "data-h2-border-width": "base(0)",
            "data-h2-padding": "base(0)",
          }
        : {
            "data-h2-background": "base(foreground)",
          })}
      {...rest}
    />
  );
};

export default BoundingBox;
