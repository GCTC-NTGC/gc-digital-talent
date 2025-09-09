import { HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

const section = tv({ base: "outline-none" });

export interface SectionProps {
  id: string;
}

const Section = ({
  id,
  children,
  className,
  ...rest
}: SectionProps & HTMLAttributes<HTMLDivElement>) => (
  <div
    data-is-toc-section // Used to find section elements in the Navigation component
    id={id}
    tabIndex={-1}
    className={section({ class: className })}
    {...rest}
  >
    {children}
  </div>
);

export default Section;
