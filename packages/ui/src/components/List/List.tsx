import {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  OlHTMLAttributes,
} from "react";
import { tv, VariantProps } from "tailwind-variants";

const list = tv({
  base: "list-outside pl-8",
  variants: {
    unStyled: {
      true: "list-none p-0",
    },
    space: {
      sm: "[&_li]:mb-0.75",
      md: "[&_li]:mb-1.5",
      lg: "[&_li]:mb-3",
      xl: "[&_li]:mb-6",
    },
  },
});

type ListVariants = VariantProps<typeof list>;

interface ULProps
  extends ListVariants,
    DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement> {}

const UL = forwardRef<HTMLUListElement, ULProps>(
  ({ className, unStyled, space, ...rest }, forwardedRef) => (
    <ul
      ref={forwardedRef}
      className={list({ unStyled, space, class: ["list-disc", className] })}
      {...rest}
    />
  ),
);

interface OLProps
  extends ListVariants,
    DetailedHTMLProps<OlHTMLAttributes<HTMLOListElement>, HTMLOListElement> {}

const OL = forwardRef<HTMLOListElement, OLProps>(
  ({ className, unStyled, space, ...rest }, forwardedRef) => (
    <ol
      ref={forwardedRef}
      className={list({ unStyled, space, class: ["list-decimal", className] })}
      {...rest}
    />
  ),
);

export default { UL, OL };
