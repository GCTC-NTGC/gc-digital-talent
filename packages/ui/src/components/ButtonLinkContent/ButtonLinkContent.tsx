import React from "react";
import ArrowTopRightOnSquareIcon from "@heroicons/react/20/solid/ArrowTopRightOnSquareIcon";
import { useIntl } from "react-intl";

import { uiMessages } from "@gc-digital-talent/i18n";

import { ButtonLinkMode, IconType } from "../../types";
import Counter from "../Button/Counter";

interface IconTextProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  mode: ButtonLinkMode;
  icon?: IconType;
  counter?: number;
  utilityIcon?: IconType;
  newTab?: boolean;
}

const ButtonLinkContent = ({
  children,
  icon,
  counter,
  utilityIcon,
  mode,
  newTab = false,
  ...rest
}: IconTextProps) => {
  const intl = useIntl();
  if (!newTab && !icon && !utilityIcon) return <span>{children}</span>;
  const Icon = icon;
  const UtilityIcon = utilityIcon;

  if (mode === "cta") {
    return (
      <>
        <div
          data-h2-display="base(flex) base:children[>*](inline-block)"
          data-h2-padding="base(calc(x.5 - 3px))"
          data-h2-align-self="base(stretch)"
          data-h2-align-items="base(center)"
        >
          {Icon && (
            <Icon
              data-h2-width="base(x1)"
              data-h2-vertical-align="base(middle)"
            />
          )}
        </div>
        <div
          data-h2-display="base:children[>*](inline-block)"
          data-h2-padding="base(calc(x.5 - 3px) calc(x1 - 3px))"
          data-h2-vertical-align="base:children[>*](middle)"
          {...rest}
        >
          <span
            data-h2-font-size="base(body)"
            data-h2-font-weight="base(700)"
            data-h2-text-decoration="base(underline)"
          >
            {children}
          </span>
          {UtilityIcon && (
            <UtilityIcon
              data-h2-width="base(x1)"
              data-h2-margin-left="base(x.25)"
            />
          )}
          {newTab && (
            <ArrowTopRightOnSquareIcon
              aria-label={intl.formatMessage(uiMessages.newTab)}
              data-h2-width="base(x1)"
              data-h2-margin-left="base(x.25)"
            />
          )}
          {counter && <Counter count={counter} />}
        </div>
      </>
    );
  }
  return (
    <div
      data-h2-display="base:children[>*](inline-block)"
      data-h2-vertical-align="base:children[>*](middle)"
      {...rest}
    >
      {Icon && (
        <Icon data-h2-margin-right="base(x.25)" data-h2-width="base(x1)" />
      )}
      <span
        data-h2-font-size="base(body)"
        data-h2-text-decoration="base(underline)"
      >
        {children}
      </span>
      {UtilityIcon && (
        <UtilityIcon
          data-h2-width="base(x1)"
          data-h2-margin-left="base(x.25)"
        />
      )}
      {newTab && (
        <ArrowTopRightOnSquareIcon
          aria-label={intl.formatMessage(uiMessages.newTab)}
          data-h2-width="base(x1)"
          data-h2-margin-left="base(x.25)"
        />
      )}
      {counter && <Counter count={counter} />}
    </div>
  );
};

export default ButtonLinkContent;
