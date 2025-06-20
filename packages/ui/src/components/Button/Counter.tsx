import { DetailedHTMLProps, HTMLAttributes, forwardRef } from "react";
import { tv } from "tailwind-variants";

const counter = tv({
  base: "ml-2 rounded-md p-1 text-sm/[1] font-bold transition-all duration-200 ease-linear",
});

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
      className={counter({ class: [className, "counter"] })}
      {...rest}
    >
      {count}
    </span>
  ),
);

export default Counter;
