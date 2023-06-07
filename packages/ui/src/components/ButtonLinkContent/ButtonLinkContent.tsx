import React from "react";

import { ButtonLinkMode, IconType } from "../../types";
import IconWrapper from "./IconWrapper";
import TextWrapper from "./TextWrapper";

interface IconTextProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {
  mode: ButtonLinkMode;
  icon?: IconType;
  utilityIcon?: IconType;
  newTab?: boolean;
}

const ButtonLinkContent = ({
  children,
  icon,
  utilityIcon,
  mode,
  newTab = false,
  ...rest
}: IconTextProps) => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!newTab && !icon && !utilityIcon) return <>{children}</>;
  const Icon = icon;
  const UtilityIcon = utilityIcon;

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
      {Icon && (
        <IconWrapper mode={mode}>
          <Icon
            {...(mode !== "cta" && {
              "data-h2-margin": "base(0 x.25 0 0)",
            })}
          />
        </IconWrapper>
      )}
      <TextWrapper mode={mode} newTab={newTab}>
        {children}
      </TextWrapper>
      {UtilityIcon && <UtilityIcon data-h2-margin="base(0 0 0 x.25)" />}
    </span>
  );
};

export default ButtonLinkContent;
