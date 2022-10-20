import React from "react";
import type { SubAlertProps, Color } from "./Alert";
import { typeMap } from "./Alert";

const iconStyleMap: Record<Color, Record<string, string>> = {
  success: {
    "data-h2-background-color": "base(dt-success)",
  },
  warning: {
    "data-h2-background-color": "base(tm-yellow)",
  },
  info: {
    "data-h2-background-color": "base(tm-blue)",
  },
};

const LargeAlert = ({
  title,
  children,
  icon,
  type,
  ...rest
}: SubAlertProps) => {
  const Icon = icon;
  return (
    <div
      className={`Alert Alert--large Alert--${type}`}
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column) p-tablet(row)"
      data-h2-radius="base(input)"
      data-h2-shadow="base(s)"
      data-h2-margin="base(x1, 0)"
      {...typeMap[type]}
      {...rest}
    >
      <div
        className="Alert__Icon"
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-justify-content="base(center)"
        data-h2-position="base(relative)"
        data-h2-padding="base(x1)"
        {...iconStyleMap[type]}
      >
        <Icon data-h2-width="base(5rem)" />
      </div>
      <div
        style={{ flexGrow: 1 }}
        data-h2-align-self="base(center)"
        data-h2-padding="base(x2, x1, x1, x1) p-tablet(x1, x1, x1, x3)"
      >
        <p data-h2-font-size="base(h5)" data-h2-font-weight="base(600)">
          {title}
        </p>
        <div data-h2-margin="base(0, 0, 0, 0)">{children}</div>
      </div>
    </div>
  );
};

export default LargeAlert;
