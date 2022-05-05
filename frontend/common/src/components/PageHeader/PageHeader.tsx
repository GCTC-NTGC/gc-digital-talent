import React from "react";

import "./pageHeader.css";

export interface PageHeaderProps {
  icon?: React.FC<{ className: string }>;
}

const PageHeader: React.FC<PageHeaderProps> = ({ icon, children, ...rest }) => {
  const Icon = icon || null;

  return (
    <h1
      data-h2-display="b(flex)"
      data-h2-font-weight="b(800)"
      data-h2-align-items="b(center)"
      data-h2-margin="b(top, none) b(bottom, m)"
      data-h2-justify-content="b(start)"
    >
      {Icon && <Icon className="page-header__icon" />}
      <span>{children}</span>
    </h1>
  );
};

export default PageHeader;
