import React from "react";

import { IconType, IconProps } from "@gc-digital-talent/ui";

export type Color =
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "quinary";

export type CallToActionProps<T> = React.HTMLProps<T> & {
  Icon: IconType | ((props: IconProps) => JSX.Element);
  color: Color;
};
