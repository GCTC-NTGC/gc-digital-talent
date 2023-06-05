import React from "react";

import { ButtonLinkMode, IconType } from "../../types";
import IconWrapper from "./IconWrapper";

interface IconTextProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {
  mode: ButtonLinkMode;
  icon?: IconType;
}

const ButtonLinkContent = ({
  children,
  icon,
  mode,
  ...rest
}: IconTextProps) => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!icon) return <span>{children}</span>;
  const Icon = icon;

  return (
    <span
      data-h2-display="base(flex)"
      data-h2-align-items="base(center)"
      {...(mode === "cta"
        ? {
            "data-h2-width": "base:children[svg](var(--h2-font-size-h5))",
          }
        : {
            "data-h2-width": "base:children[svg](1rem)",
          })}
      {...rest}
    >
      <IconWrapper mode={mode}>
        <Icon
          {...(mode !== "cta" && {
            "data-h2-margin": "base(0 x.25 0 0)",
          })}
        />
      </IconWrapper>
      <span
        {...(mode === "cta" && {
          "data-h2-radius": "base(0 s s 0)",
          "data-h2-padding": "base(x.5 x1)",
        })}
      >
        {children}
      </span>
    </span>
  );
};

export default ButtonLinkContent;
