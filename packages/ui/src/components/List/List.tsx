import {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  OlHTMLAttributes,
} from "react";
import { tv, VariantProps } from "tailwind-variants";

const list = tv({
  base: "pl-8",
  variants: {
    type: {
      ordered: "list-decimal",
      unordered: "list-disc",
    },
    space: {
      sm: "[&_li]:mb-0.75",
      md: "[&_li]:mb-1.5",
      lg: "[&_li]:mb-3",
      xl: "[&_li]:mb-6",
    },
    unStyled: {
      true: "list-none p-0",
      false: "",
    },
  },
});

type ListVariants = Omit<VariantProps<typeof list>, "type">;

interface ULProps
  extends ListVariants,
    DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement> {}

const UL = forwardRef<HTMLUListElement, ULProps>(
  ({ className, unStyled, space, ...rest }, forwardedRef) => (
    <ul
      ref={forwardedRef}
      className={list({ type: "unordered", unStyled, space, class: className })}
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
      className={list({ type: "ordered", unStyled, space, class: className })}
      {...rest}
    />
  ),
);

export default { UL, OL };
