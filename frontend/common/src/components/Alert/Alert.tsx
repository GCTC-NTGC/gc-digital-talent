import * as React from "react";

export type Color = "success";

export interface AlertProps {
  title: React.ReactNode | string;
  message: React.ReactNode | string;
  icon: React.ReactNode;
  type: "success";
}

const typeMap = {
  success: {
    "data-h2-border": "base(all, 1px, solid, dt-success)",
    "data-h2-background-color": "base(light.dt-success.1)",
    "data-h2-color": "base(dt-success)",
  },
};

const Alert: React.FunctionComponent<AlertProps> = ({
  title,
  message,
  icon,
  type,
  ...rest
}) => {
  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-radius="base(s)"
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
        <span data-h2-margin="base(0, x.25, 0, 0)">{icon}</span>
        {title}
      </p>
      <p data-h2-margin="base(0, 0, 0, 0)">{message}</p>
    </div>
  );
};

export default Alert;
