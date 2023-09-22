import React from "react";

interface CounterInterface
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {
  count: number;
}

const Counter = React.forwardRef<HTMLSpanElement, CounterInterface>(
  ({ count }) => {
    return (
      <span
        className="counter"
        data-h2-padding="base(x.15)"
        data-h2-radius="base(rounded)"
        data-h2-margin-left="base(x.35)"
        data-h2-font-size="base(caption, 1)"
        data-h2-font-weight="base(700)"
        data-h2-transition="base(all .2s ease)"
      >
        {count}
      </span>
    );
  },
);

export default Counter;
