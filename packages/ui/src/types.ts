export type Color =
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "quinary"
  | "success"
  | "warning"
  | "error"
  | "black"
  | "white";

export type HeadingRank = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type IconProps = React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
  title?: string;
  titleId?: string;
} & React.RefAttributes<SVGSVGElement>;

export type IconType = React.ForwardRefExoticComponent<IconProps>;

type HydrogenAttributeKey = `data-h2-${string}`;

type HydrogenAttributes = {
  [dataAttribute: HydrogenAttributeKey]: unknown;
};

export type ButtonLinkMode = "solid" | "inline" | "cta" | "text";

export type ButtonLinkProps = {
  color?: Color;
  block?: boolean;
  mode?: ButtonLinkMode;
  icon?: IconType;
  utilityIcon?: IconType;
  counter?: number;
} & HydrogenAttributes;
