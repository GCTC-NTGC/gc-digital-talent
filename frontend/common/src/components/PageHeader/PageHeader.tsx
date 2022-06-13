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
      data-h2-font-weight="b(300)"
      data-h2-align-items="b(center)"
      data-h2-margin="b(0, auto, x1, auto)"
      data-h2-justify-content="b(start)"
      {...rest}
    >
      {Icon && <Icon className="page-header__icon" />}
      <span>{children}</span>
    </h1>
  );
};

export default PageHeader;
