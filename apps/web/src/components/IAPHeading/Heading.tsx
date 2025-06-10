import { ReactNode } from "react";
import { tv } from "tailwind-variants";

interface HeadingProps {
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  color?: "pink" | "white";
  thin?: boolean;
  className?: string;
  children?: ReactNode;
}

const heading = tv({
  base: "font-bold",
  defaultVariants: {
    color: "pink",
  },
  variants: {
    thin: {
      true: "font-thin",
    },
    color: {
      pink: "text-primary-500 dark:text-primary-100",
      white: "text-white dark:text-white",
    },
    size: {
      h1: "text-5xl/[1.1] lg:text-6xl/[1.1]",
      h2: "mt-12 mb-3 text-4xl/[1.1] lg:text-5xl/[1.1]",
      h3: "mt-9 mb-1.5 text-3xl/[1.1] lg:text-4xl/[1.1]",
      h4: "mt-9 mb-1.5 text-2xl/[1.1] lg:text-3xl/[1.1]",
      h5: "mt-6 mb-1.5 text-xl/[1.1] lg:text-2xl/[1.1]",
      h6: "mt-6 mb-1.5 text-lg/[1.1] lg:text-xl/[1.1]",
    },
  },
  compoundVariants: [
    {
      thin: false,
      size: ["h1", "h2", "h6"],
      class: "font-bold",
    },
  ],
});

const Heading = ({
  level = "h2",
  size = "h2",
  color = "pink",
  thin = false,
  className,
  children,
  ...rest
}: HeadingProps) => {
  const El = level;

  return (
    <El
      className={heading({
        thin,
        size: size ?? level,
        color,
        class: className,
      })}
      {...rest}
    >
      {children}
    </El>
  );
};

export default Heading;
