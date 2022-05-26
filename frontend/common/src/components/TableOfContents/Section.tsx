import React, { HTMLAttributes } from "react";

export interface SectionProps {
  id: string;
}

const Section: React.FC<SectionProps & HTMLAttributes<HTMLDivElement>> = ({
  id,
  children,
  ...rest
}) => (
  <div id={id} data-h2-margin="b(top, l)" {...rest}>
    {children}
  </div>
);

export default Section;
