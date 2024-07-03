import { HTMLProps } from "react";

type WrapperProps = HTMLProps<HTMLDivElement>;

const Wrapper = ({ children, ...rest }: WrapperProps) => (
  <div data-h2-padding="base(0, 0, x3, 0)" {...rest}>
    <div data-h2-wrapper="base(center, full, 0)">
      <div data-h2-flex-grid="base(flex-start, x2, 0) l-tablet(stretch, x3)">
        {children}
      </div>
    </div>
  </div>
);

export default Wrapper;
