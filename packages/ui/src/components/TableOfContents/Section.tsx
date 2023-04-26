import React, { HTMLAttributes } from "react";

export interface SectionProps {
  id: string;
}

const Section = ({
  id,
  children,
  ...rest
}: SectionProps & HTMLAttributes<HTMLDivElement>) => (
  <div id={id} tabIndex={-1} data-h2-outline="base(none)" {...rest}>
    {children}
  </div>
);

export default Section;
