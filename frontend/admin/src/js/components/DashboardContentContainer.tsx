import React from "react";

export const DashboardContentContainer: React.FC = ({
  children,
}): React.ReactElement => {
  return (
    <div data-h2-container="base(center, large, x2)">
      <div data-h2-padding="base(0, 0, x3, 0)">{children}</div>
    </div>
  );
};

export default DashboardContentContainer;
