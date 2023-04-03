import React from "react";

export type Color =
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "quinary";

export type CallToActionProps<T> = React.HTMLProps<T> & {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: Color;
};
