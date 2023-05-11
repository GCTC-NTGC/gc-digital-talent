import React from "react";

const ContentWrapper = ({
  children,
  ...rest
}: React.HTMLProps<HTMLDivElement>) => (
  <div
    data-h2-padding="base(x.5, x1)"
    data-h2-font-weight="base(700)"
    data-h2-text-decoration="base(underline)"
    data-h2-width="base(100%)"
    {...rest}
  >
    {children}
  </div>
);

export default ContentWrapper;
