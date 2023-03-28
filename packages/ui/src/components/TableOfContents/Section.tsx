import React, { HTMLAttributes } from "react";

export interface SectionProps {
  id: string;
}

const Section = ({
  id,
  children,
  ...rest
}: SectionProps & HTMLAttributes<HTMLDivElement>) => (
  <div id={id} {...rest}>
    {children}
  </div>
);

export default Section;
