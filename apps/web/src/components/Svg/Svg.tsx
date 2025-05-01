import { forwardRef, ReactNode, SVGProps as ReactSVGProps } from "react";

export type SVGProps = ReactSVGProps<SVGSVGElement>;

interface SvgComponentProps extends SVGProps {
  children: ReactNode;
}

const Svg = forwardRef<SVGSVGElement, SvgComponentProps>(
  ({ children, ...rest }, forwardedRef) => (
    <svg ref={forwardedRef} xmlns="http://www.w3.org/2000/svg" {...rest}>
      {children}
    </svg>
  ),
);

export default Svg;
