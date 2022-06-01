import React, { HTMLAttributes } from "react";

import "./heading.css";

export interface HeadingProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  icon?: React.FC<{ className: string }>;
}

const Heading: React.FC<HeadingProps & HTMLAttributes<HTMLHeadingElement>> = ({
  icon,
  children,
  as = "h2",
  ...rest
}) => {
  const El = as;
  const Icon = icon || null;

  return (
    <El
      data-h2-display="b(flex)"
      data-h2-font-weight="b(800)"
      data-h2-align-items="b(center)"
      data-h2-margin="b(top, none) b(bottom, m)"
      data-h2-justify-content="b(start)"
      {...rest}
    >
      {Icon && <Icon className="toc-heading__icon" />}
      <span>{children}</span>
    </El>
  );
};

export default Heading;
