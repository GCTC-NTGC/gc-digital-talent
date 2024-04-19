import React from "react";

type CounterProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
> & {
  count: number;
};

const Counter = React.forwardRef<HTMLSpanElement, CounterProps>(
  ({ count, ...rest }, forwardedRef) => (
    <span
      ref={forwardedRef}
      className="counter font-bold"
      data-h2-padding="base(x.15)"
      data-h2-radius="base(rounded)"
      data-h2-margin-left="base(x.35)"
      data-h2-font-size="base(caption, 1)"
      data-h2-transition="base(all .2s ease)"
      {...rest}
    >
      {count}
    </span>
  ),
);

export default Counter;
