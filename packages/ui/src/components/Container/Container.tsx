import { DetailedHTMLProps, forwardRef, HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

const container = tv({
  base: "w-full px-6 xs:px-12",
  variants: {
    center: {
      true: "mx-auto",
    },
    xs: {
      sm: "xs:max-w-2xl",
      md: "xs:max-w-5xl",
      lg: "xs:max-w-6xl",
      full: "xs:max-w-full",
    },
    base: {
      sm: "max-w-2xl",
      md: "max-w-5xl",
      lg: "max-w-6xl",
      full: "max-w-full",
    },
    sm: {
      sm: "sm:max-w-2xl",
      md: "sm:max-w-5xl",
      lg: "sm:max-w-6xl",
      full: "sm:max-w-full",
    },
    md: {
      sm: "md:max-w-2xl",
      md: "md:max-w-5xl",
      lg: "md:max-w-6xl",
      full: "md:max-w-full",
    },
    lg: {
      sm: "lg:max-w-2xl",
      md: "lg:max-w-5xl",
      lg: "lg:max-w-6xl",
      full: "lg:max-w-full",
    },
    xl: {
      sm: "xl:max-w-2xl",
      md: "xl:max-w-5xl",
      lg: "xl:max-w-6xl",
      full: "xl:max-w-full",
    },
  },
  defaultVariants: {
    base: "md",
    size: "sm",
    center: false,
  },
});

type SizeOption = "sm" | "md" | "lg" | "full";
interface ResponsiveSize {
  xs?: SizeOption;
  base?: SizeOption;
  sm?: SizeOption;
  md?: SizeOption;
  lg?: SizeOption;
  xl?: SizeOption;
}
type SizeProp = SizeOption | ResponsiveSize;

interface ContainerProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  size?: SizeProp;
  center?: boolean;
}

function normalizeSize(size: SizeProp | undefined): ResponsiveSize {
  if (typeof size === "string") {
    return { base: size };
  }
  return { base: size?.base ?? "md", ...size };
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ center = false, size = "md", className, ...rest }, ref) => {
    const { xs, base, sm, md, lg, xl } = normalizeSize(size);

    return (
      <div
        ref={ref}
        className={container({ center, xs, base, sm, md, lg, xl, className })}
        {...rest}
      />
    );
  },
);

Container.displayName = "Container";
