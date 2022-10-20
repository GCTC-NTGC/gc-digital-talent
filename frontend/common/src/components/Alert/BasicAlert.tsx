import React from "react";
import type { SubAlertProps } from "./Alert";
import { typeMap } from "./Alert";

const BasicAlert = ({
  title,
  children,
  icon,
  type,
  ...rest
}: SubAlertProps) => {
  const Icon = icon;
  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-radius="base(input)"
      data-h2-shadow="base(s)"
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

export default BasicAlert;
