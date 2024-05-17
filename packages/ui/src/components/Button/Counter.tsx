import { DetailedHTMLProps, HTMLAttributes, forwardRef } from "react";

import { cn } from "../../utils";

type CounterProps = DetailedHTMLProps<
  HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
> & {
  count: number;
};

const Counter = forwardRef<HTMLSpanElement, CounterProps>(
  ({ count, className, ...rest }, forwardedRef) => (
    <span
      ref={forwardedRef}
      className={cn(
        "counter ml-2 flex items-center rounded-md p-1 font-bold transition-all duration-200 ease-in-out",
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
