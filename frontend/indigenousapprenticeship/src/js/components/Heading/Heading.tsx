import * as React from "react";

interface HeadingProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({ as = "h2", children, ...rest }) => {
  const El = as;

  return (
        <El
            data-h2-font-color="b(ia-darkpink)"
            data-h2-font-weight="b(700)"
            {...rest}
        >
            {children}
        </El>
    );
};

export default Heading;
