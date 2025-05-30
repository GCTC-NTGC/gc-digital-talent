import { HTMLAttributes } from "react";

export interface SectionProps {
  id: string;
}

const Section = ({
  id,
  children,
  ...rest
}: SectionProps & HTMLAttributes<HTMLDivElement>) => (
  <div
    data-is-toc-section // Used to find section elements in the Navigation component
    id={id}
    tabIndex={-1}
    className="outline-none"
    {...rest}
  >
    {children}
  </div>
);

export default Section;
