import * as React from "react";

const SideMenuContentWrapper = ({
  children,
}: {
  children?: React.ReactNode;
}) => <div data-h2-flex-item="base(fill)">{children}</div>;

export default SideMenuContentWrapper;
