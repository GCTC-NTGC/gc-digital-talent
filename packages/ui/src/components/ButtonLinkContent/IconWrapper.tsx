import React from "react";
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
      data-h2-align-self="base(stretch)"
      data-h2-display="base(inline-flex)"
      data-h2-align-items="base(center)"
      data-h2-padding="base(x.5) p-tablet(x.25, x.6)"
      data-h2-radius="base(s, 0, 0, s)"
      data-h2-width="base:children[svg](var(--h2-font-size-h5))"
      {...rest}
    />
  );
};

export default IconWrapper;
