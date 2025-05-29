import { DetailedHTMLProps, HTMLAttributes, forwardRef } from "react";
import { tv } from "tailwind-variants";

const counter = tv({
  base: "ease ml-2 rounded-md p-2 px-1 text-sm/1 font-bold transition-all duration-200",
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
