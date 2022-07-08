import React from "react";

export const DashboardContentContainer: React.FC = ({
  children,
}): React.ReactElement => {
  return <div
    data-h2-container="b(center, large, x2)">
    <div data-h2-padding="b(0, 0, x3, 0)">
      {children}
    </div>
  </div>;
};

export default DashboardContentContainer;
