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
    <div data-h2-padding="b(top, l)">{children}</div>
  </div>
);

export default Section;
