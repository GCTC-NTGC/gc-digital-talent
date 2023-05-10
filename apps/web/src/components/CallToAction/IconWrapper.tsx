import React from "react";

const IconWrapper = ({
  children,
  ...rest
}: React.HTMLProps<HTMLDivElement>) => (
  <div
    data-h2-align-self="base(stretch)"
    data-h2-display="base(inline-flex)"
    data-h2-align-items="base(center)"
    data-h2-padding="base(x.5) p-tablet(x.25, x.6)"
    data-h2-radius="base(rounded, 0, 0, rounded)"
    data-h2-width="base:children[svg](var(--h2-font-size-h5))"
    {...rest}
  >
    {children}
  </div>
);

export default IconWrapper;
