import * as React from "react";

export type SVGProps = React.SVGProps<SVGSVGElement>;

interface SvgComponentProps extends SVGProps {
  children: React.ReactNode;
}

const Svg = ({ children, ...rest }: SvgComponentProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMinYMin meet"
    {...rest}
  >
    {children}
  </svg>
);

export default Svg;
