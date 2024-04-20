import React from "react";

import { cn } from "../../utils";

type CounterProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
> & {
  count: number;
};

const Counter = React.forwardRef<HTMLSpanElement, CounterProps>(
  ({ count, className, ...rest }, forwardedRef) => (
    <span
      ref={forwardedRef}
      className={cn(
        "counter ml-2 rounded-md font-bold transition-all duration-200 ease-in-out",
        className,
      )}
      data-h2-font-size="base(caption, 1)"
      {...rest}
    >
      {count}
    </span>
  ),
);

export default Counter;
