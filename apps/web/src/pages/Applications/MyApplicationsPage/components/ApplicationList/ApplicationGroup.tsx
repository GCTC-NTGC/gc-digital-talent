import React from "react";

interface ApplicationGroupProps {
  children: React.ReactNode;
}

const ApplicationGroup = ({ children }: ApplicationGroupProps) => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column)"
    data-h2-gap="base(x0.5, 0)"
  >
    {children}
  </div>
);

export default ApplicationGroup;
