import React from "react";
import Heading from "../Heading";

import "./pageHeader.css";

export interface PageHeaderProps {
  icon?: React.FC<{ className: string }>;
}

const PageHeader: React.FC<PageHeaderProps> = ({ icon, children, ...rest }) => {
  const Icon = icon || null;

  return (
    <Heading
      level="h1"
      data-h2-display="b(flex)"
      data-h2-align-items="b(center)"
      data-h2-margin="b(top, none) b(bottom, m)"
      data-h2-justify-content="b(start)"
      {...rest}
    >
      {Icon && <Icon className="page-header__icon" />}
      <span>{children}</span>
    </Heading>
  );
};

export default PageHeader;
