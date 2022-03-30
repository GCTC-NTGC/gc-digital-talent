import React from "react";

export const DashboardContentContainer: React.FC = ({
  children,
}): React.ReactElement => {
  return <div data-h2-padding="b(all, m)">{children}</div>;
};

export default DashboardContentContainer;
