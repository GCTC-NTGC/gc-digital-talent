import type {
  PropsWithoutRef,
  SVGProps,
  RefAttributes,
  ElementType,
  ForwardRefExoticComponent,
  JSX,
} from "react";

export const COLOR = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
  BLACK: "black",
  WHITE: "white",
};

type ObjectValues<T> = T[keyof T];
export type Color = ObjectValues<typeof COLOR>;

export type HeadingRank = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type IconProps = PropsWithoutRef<SVGProps<SVGSVGElement>> & {
  title?: string;
  titleId?: string;
} & RefAttributes<SVGSVGElement>;

export type IconType =
  | ElementType<IconProps>
  | ForwardRefExoticComponent<IconProps>;

type PropsOf<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T];
export type PolymorphicProps<
  T extends keyof JSX.IntrinsicElements,
  P = object,
> = P & { as?: T } & Omit<PropsOf<T>, keyof P | "as">;
