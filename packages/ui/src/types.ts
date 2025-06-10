import {
  PropsWithoutRef,
  SVGProps,
  RefAttributes,
  ElementType,
  ForwardRefExoticComponent,
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

type HydrogenAttributeKey = `data-h2-${string}`;

export type HydrogenAttributes = Record<HydrogenAttributeKey, unknown>;

export type ButtonLinkMode =
  | "solid"
  | "inline"
  | "cta"
  | "text"
  | "placeholder"
  | "icon_only";
