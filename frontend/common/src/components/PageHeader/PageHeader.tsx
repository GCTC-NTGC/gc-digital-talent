import React from "react";

import "./pageHeader.css";

export interface PageHeaderProps {
  icon?: React.FC<{ className: string }>;
}

const PageHeader: React.FC<PageHeaderProps> = ({ icon, children, ...rest }) => {
  const Icon = icon || null;

  return (
    <h1
      data-h2-margin="b(x2, 0, x1, 0)"
      {...rest}
    >
      {Icon && <Icon
        data-h2-display="b(inline-block)"
        data-h2-margin="b(0, x1, 0, 0)"
        data-h2-width="b(x2.5)"
        data-h2-vertical-align="b(middle)"
        className="page-header__icon" />}
      <span data-h2-vertical-align="b(middle)">{children}</span>
    </h1>
  );
};

export default PageHeader;
