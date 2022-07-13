import React from "react";
import Heading from "../Heading";

import "./pageHeader.css";

export interface PageHeaderProps {
  icon?: React.FC<{ className: string }>;
}

const PageHeader: React.FC<PageHeaderProps> = ({ icon, children, ...rest }) => {
  const Icon = icon || null;

  return (
    <Heading level="h1" {...rest}>
      {Icon && (
        <Icon
          className="page-header__icon"
          data-h2-margin="base(0, x1, 0, 0)"
          data-h2-width="base(x2)"
          data-h2-vertical-align="base(middle)"
        />
      )}
      <span data-h2-vertical-align="base(middle)">{children}</span>
    </Heading>
  );
};

export default PageHeader;
