import {
  PropsWithoutRef,
  SVGProps,
  RefAttributes,
  ElementType,
  ForwardRefExoticComponent,
  JSX,
} from "react";

export type Color =
  | "primary"
  | "secondary"
  | "secondaryDarkFixed"
  | "tertiary"
  | "quaternary"
  | "quinary"
  | "success"
  | "warning"
  | "error"
  | "black"
  | "blackFixed"
  | "white"
  | "whiteFixed";

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
