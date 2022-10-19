import * as React from "react";

export type Color = "success" | "warning";

export interface AlertProps {
  title: React.ReactNode | string;
  children: React.ReactNode;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  type: Color;
}

const typeMap: Record<Color, Record<string, string>> = {
  success: {
    "data-h2-border": "base(all, 1px, solid, dt-success)",
    "data-h2-background-color": "base(light.dt-success.1)",
    "data-h2-color": "base(dt-success)",
  },
  warning: {
    "data-h2-border": "base(all, 1px, solid, tm-yellow)",
    "data-h2-background-color": "base(light.tm-yellow.1)",
    "data-h2-color": "base(darker.tm-yellow)",
  },
};

const Alert: React.FunctionComponent<AlertProps> = ({
  title,
  children,
  icon,
  type,
  ...rest
}) => {
  const Icon = icon;
  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-radius="base(input)"
      data-h2-padding="base(x1)"
      data-h2-margin="base(x1, 0)"
      {...typeMap[type]}
      {...rest}
    >
      <p
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-font-weight="base(600)"
      >
        <Icon
          data-h2-vertical-align="base(top)"
          data-h2-margin="base(0, x.25, 0, 0)"
          style={{ height: "1em", width: "1em" }}
        />
        <span>{title}</span>
      </p>
      <div data-h2-margin="base(0, 0, 0, 0)">{children}</div>
    </div>
  );
};

export default Alert;
