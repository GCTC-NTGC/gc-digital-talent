import * as React from "react";

import { IconType } from "@gc-digital-talent/ui";

interface IconLabelProps {
  label: React.ReactNode;
  icon: IconType;
  children?: React.ReactNode;
}

const IconLabel = ({ label, icon, children }: IconLabelProps) => {
  const Icon = icon;

  return (
    <p
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(x1 1fr)"
      data-h2-gap="base(0, x.25)"
    >
      <span
        data-h2-display="base(inline-block)"
        data-h2-height="base(x1)"
        data-h2-width="base(x1)"
        data-h2-vertical-align="base(middle)"
      >
        <Icon />
      </span>
      <span>
        <span
          data-h2-font-weight="base(700)"
          data-h2-display="base(inline-block)"
          data-h2-margin-right="base(x.15)"
        >
          {label}
        </span>
        {children && <span>{children}</span>}
      </span>
    </p>
  );
};

export default IconLabel;
