import React from "react";

import "./heading.css";

export interface HeadingProps {
  icon?: React.FC<{ className: string }>;
}

const Heading: React.FC<HeadingProps> = ({ icon, children, ...rest }) => {
  const Icon = icon || null;

  return (
    <h1
      data-h2-display="b(flex)"
      data-h2-font-weight="b(800)"
      data-h2-align-items="b(center)"
      data-h2-margin="b(top, none) b(bottom, m)"
      data-h2-justify-content="b(start)"
      {...rest}
    >
      {Icon && <Icon className="toc-heading__icon" />}
      <span>{children}</span>
    </h1>
  );
};

export default Heading;
