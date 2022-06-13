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
    "data-h2-border": "b(all, 1px, solid, dt-success)",
    "data-h2-background-color": "b(light.dt-succes.1)",
    "data-h2-color": "b(dt-success)",
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
      data-h2-display="b(flex)"
      data-h2-flex-direction="b(column)"
      data-h2-radius="b(s)"
      data-h2-padding="b(0, x.5)"
      data-h2-margin="b(x1, auto)"
      {...typeMap[type]}
      {...rest}
    >
      <p
        data-h2-display="b(flex)"
        data-h2-align-items="b(center)"
        data-h2-font-weight="b(600)"
      >
        <span data-h2-margin="b(auto, x.25, auto, auto)">{icon}</span>
        {title}
      </p>
      <p data-h2-margin="b(0, auto, auto, auto)">{message}</p>
    </div>
  );
};

export default Alert;
