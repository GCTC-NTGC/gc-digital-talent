import { DetailedHTMLProps, InputHTMLAttributes } from "react";

import { cn } from "@gc-digital-talent/ui";

import useInputStyles from "../../hooks/useInputStyles";

type BoundingBoxProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  flat?: boolean;
};

const BoundingBox = ({ flat, className, ...rest }: BoundingBoxProps) => {
  const styles = useInputStyles();

  return (
    <div
      className={cn("mt-1.5 flex flex-col gap-y-1.5", className)}
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
