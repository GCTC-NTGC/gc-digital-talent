import React from "react";

import { IconType } from "../../types";

interface IconTextProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {
  icon?: IconType;
}

const IconText = ({ children, icon, ...rest }: IconTextProps) => {
  console.log(icon);
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!icon) return <>{children}</>;
  const Icon = icon;

  return (
    <span
      data-h2-display="base(flex)"
      data-h2-align-items="base(center)"
      {...rest}
    >
      <Icon data-h2-margin="base(0, x.25, 0, 0)" data-h2-width="base(1rem)" />
      <span>{children}</span>
    </span>
  );
};

export default IconText;
