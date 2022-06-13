import React, { HTMLAttributes } from "react";

export interface SectionProps {
  id: string;
}

const Section: React.FC<SectionProps & HTMLAttributes<HTMLDivElement>> = ({
  id,
  children,
  ...rest
}) => (
  <div id={id} {...rest}>
    <div data-h2-padding="b(x2, 0, 0, 0)">{children}</div>
  </div>
);

export default Section;
