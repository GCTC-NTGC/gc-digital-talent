import * as React from "react";

import { ButtonLinkMode, IconType } from "../../types";

interface IconWrapperProps {
  children: React.ReactElement<IconType>;
  mode: ButtonLinkMode;
}

const IconWrapper = ({ mode, ...rest }: IconWrapperProps) => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (mode !== "cta") return <React.Fragment {...rest} />;

  return (
    <span
      className="ButtonLink__Icon"
      data-h2-align-self="base(stretch)"
      data-h2-display="base(inline-flex)"
      data-h2-align-items="base(center)"
      data-h2-padding="base(x.5) p-tablet(x.25, x.6)"
      data-h2-radius="base(s 0 0 s)"
      {...rest}
    />
  );
};

export default IconWrapper;
