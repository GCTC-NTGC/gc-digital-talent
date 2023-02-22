import React from "react";

const SideMenuContentWrapper: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => <div data-h2-flex-item="base(fill)">{children}</div>;

export default SideMenuContentWrapper;
