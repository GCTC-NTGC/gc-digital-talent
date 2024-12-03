import { ReactNode } from "react";

interface HeadingProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  color?: "pink" | "white";
  className?: string;
  light?: boolean;
  children?: ReactNode;
}

const Heading = ({
  as = "h2",
  color = "pink",
  light,
  children,
  ...rest
}: HeadingProps) => {
  const El = as;

  return (
    <El
      {...(color === "pink"
        ? { "data-h2-color": "base(primary.dark) base:dark(primary.lightest)" }
        : { "data-h2-color": "base(white)" })}
      {...(light
        ? { "data-h2-font-weight": "base(100)" }
        : { "data-h2-font-weight": "base(700)" })}
      {...rest}
    >
      {children}
    </El>
  );
};

export default Heading;
