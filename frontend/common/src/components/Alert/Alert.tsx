import * as React from "react";
import BasicAlert from "./BasicAlert";
import LargeAlert from "./LargeAlert";

import "./alert.css";

export type Color = "success" | "warning" | "info";
export type AlertMode = "basic" | "large";

export interface AlertProps {
  title: React.ReactNode | string;
  children: React.ReactNode;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  type: Color;
  mode?: AlertMode;
}

export type SubAlertProps = Omit<AlertProps, "mode">;

export const typeMap: Record<Color, Record<string, string>> = {
  success: {
    "data-h2-border": "base(all, 0.25rem, solid, dark.dt-success)",
    "data-h2-background-color": "base(light.dt-success.1)",
    "data-h2-color": "base(black)",
  },
  warning: {
    "data-h2-border": "base(all, 0.25rem, solid, dark.tm-yellow)",
    "data-h2-background-color": "base(light.tm-yellow)",
    "data-h2-color": "base(black)",
  },
  info: {
    "data-h2-border": "base(all, 0.25rem, solid, dark.tm-blue)",
    "data-h2-background-color": "base(light.tm-blue)",
    "data-h2-color": "base(black)",
  },
};

const Alert: React.FunctionComponent<AlertProps> = ({
  mode = "basic",
  ...rest
}) => {
  const alertMap: Record<AlertMode, React.FC<SubAlertProps>> = {
    basic: BasicAlert,
    large: LargeAlert,
  };

  const SubAlert = alertMap[mode];

  return <SubAlert {...rest} />;
};

export default Alert;
