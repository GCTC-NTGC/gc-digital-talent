import * as React from "react";

interface HeadingProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  color?: "pink" | "white";
  className?: string;
  light?: boolean;
}

const Heading: React.FC<HeadingProps> = ({
  as = "h2",
  color = "pink",
  light,
  children,
  ...rest
}) => {
  const El = as;

  return (
    <El
      {...(color === "pink"
        ? { "data-h2-color": "b(dark.ia-primary)" }
        : { "data-h2-color": "b(ia-white)" })}
      {...(light
        ? { "data-h2-font-weight": "b(100)" }
        : { "data-h2-font-weight": "b(900)" })}
      {...rest}
    >
      {children}
    </El>
  );
};

export default Heading;
