import React from "react";

export const DashboardContentContainer: React.FC = ({
  children,
}): React.ReactElement => {
  return <div data-h2-padding="b(x1)">{children}</div>;
};

export default DashboardContentContainer;
