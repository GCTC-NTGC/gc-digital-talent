import * as React from "react";

export type Color = "success";

export interface AlertProps {
  title: string;
  message: string;
  icon: React.ReactNode;
  type: "success";
}

const typeMap = {
  success: {
    "data-h2-border": "b(green, all, solid, s)",
    "data-h2-bg-color": "b([light]green[.1])",
    "data-h2-font-color": "b(green)",
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
      data-h2-padding="b(right-left, s)"
      data-h2-margin="b(top-bottom, m)"
      {...typeMap[type]}
      {...rest}
    >
      <p
        data-h2-display="b(flex)"
        data-h2-align-items="b(center)"
        data-h2-font-weight="b(600)"
      >
        <span data-h2-margin="b(right, xs)">{icon}</span>
        {title}
      </p>
      <p data-h2-margin="b(top, none)">{message}</p>
    </div>
  );
};

export default Alert;
