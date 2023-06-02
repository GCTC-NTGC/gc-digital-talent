export type Color =
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "quinary"
  | "cta"
  | "white"
  | "black"
  | "ia-primary"
  | "ia-secondary"
  | "yellow"
  | "red"
  | "blue"
  | "purple"
  | "success"
  | "warning"
  | "error";

export type HeadingRank = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type IconProps = React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
  title?: string;
  titleId?: string;
} & React.RefAttributes<SVGSVGElement>;

export type IconType = React.ForwardRefExoticComponent<IconProps>;

export type ButtonLinkMode = "solid" | "outline" | "inline" | "cta";
