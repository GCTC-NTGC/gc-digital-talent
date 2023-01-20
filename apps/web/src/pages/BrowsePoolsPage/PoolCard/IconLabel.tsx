import React, { SVGAttributes } from "react";

interface IconLabelProps {
  label: React.ReactNode;
  icon: React.FC<SVGAttributes<SVGSVGElement>>;
  children?: React.ReactNode;
}

const IconLabel = ({ label, icon, children }: IconLabelProps) => {
  const Icon = icon;

  return (
    <p
      data-h2-align-items="base(center)"
      data-h2-display="base(inline-flex)"
      data-h2-flex-wrap="base(wrap)"
      data-h2-gap="base(0, x.5)"
      data-h2-flex-grow="base(1)"
      data-h2-margin="base(x1, 0) p-tablet(0, 0, x1, 0)"
    >
      <span
        data-h2-display="base(inline-block)"
        data-h2-height="base(x1)"
        data-h2-width="base(x1)"
        data-h2-vertical-align="base(middle)"
      >
        <Icon />
      </span>
      <span data-h2-font-weight="base(700)">{label}</span>
      {children && <span>{children}</span>}
    </p>
  );
};

export default IconLabel;
