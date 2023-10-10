import React from "react";
import ArrowTopRightOnSquareIcon from "@heroicons/react/20/solid/ArrowTopRightOnSquareIcon";
import { useIntl } from "react-intl";

import { uiMessages } from "@gc-digital-talent/i18n";

import { ButtonLinkMode, IconType } from "../../types";
import Counter from "../Button/Counter";

interface IconTextProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {
  mode: ButtonLinkMode;
  fontSize?: "h6" | "body" | "caption";
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
  fontSize,
  newTab = false,
  ...rest
}: IconTextProps) => {
  const intl = useIntl();
  let textSize = {
    "data-h2-font-size": "base(body)",
  };
  let iconSize = {
    "data-h2-width": "base(x.85)",
  };
  if (fontSize === "caption") {
    textSize = {
      "data-h2-font-size": "base(caption)",
    };
    iconSize = {
      "data-h2-width": "base(x.75)",
    };
  } else if (fontSize === "h6") {
    textSize = {
      "data-h2-font-size": "base(h6)",
    };
    iconSize = {
      "data-h2-width": "base(x.95)",
    };
  }
  let iconMargin = {
    "data-h2-margin-top": "base(0)",
  };
  if (mode === "text") {
    iconMargin = {
      "data-h2-margin-top": "base(-x.2)",
    };
  }
  let contentDisplay = {
    "data-h2-display": "base(block) base:children[>*](inline-block)",
    "data-h2-vertical-align": "base:children[>*](middle)",
  };
  if (mode === "text") {
    contentDisplay = {
      "data-h2-display":
        "base(inline) base:children[>svg, .counter](inline-block)",
      "data-h2-vertical-align": "base:children[>svg, .counter](middle)",
    };
  }
  if (!newTab && !icon && !utilityIcon)
    return (
      <span {...textSize} data-h2-text-decoration="base(underline)">
        {children}
      </span>
    );
  const Icon = icon;
  const UtilityIcon = utilityIcon;
  if (mode === "cta") {
    return (
      <>
        <span
          data-h2-display="base(flex) base:children[>*](inline-block)"
          data-h2-padding="base(calc(x.5 - 3px))"
          data-h2-align-self="base(stretch)"
          data-h2-align-items="base(center)"
        >
          {Icon && <Icon {...iconSize} data-h2-vertical-align="base(middle)" />}
        </span>
        <span
          data-h2-display="base(block) base:children[>*](inline-block)"
          data-h2-padding="base(calc(x.5 - 3px) calc(x1 - 3px))"
          data-h2-vertical-align="base:children[>*](middle)"
          {...rest}
        >
          <span
            {...textSize}
            data-h2-font-weight="base(700)"
            data-h2-text-decoration="base(underline)"
          >
            {children}
          </span>
          {UtilityIcon && (
            <UtilityIcon {...iconSize} data-h2-margin-left="base(x.25)" />
          )}
          {newTab && (
            <ArrowTopRightOnSquareIcon
              aria-label={intl.formatMessage(uiMessages.newTab)}
              {...iconSize}
            />
          )}
          {counter && <Counter count={counter} />}
        </span>
      </>
    );
  }
  return (
    <span {...contentDisplay} {...rest}>
      {Icon && (
        <Icon data-h2-margin-right="base(x.25)" {...iconSize} {...iconMargin} />
      )}
      <span {...textSize} data-h2-text-decoration="base(underline)">
        {children}
      </span>
      {UtilityIcon && (
        <UtilityIcon
          {...iconSize}
          {...iconMargin}
          data-h2-margin-left="base(x.25)"
        />
      )}
      {newTab && (
        <ArrowTopRightOnSquareIcon
          aria-label={intl.formatMessage(uiMessages.newTab)}
          {...iconSize}
          {...iconMargin}
          data-h2-margin-left="base(x.15)"
        />
      )}
      {counter && <Counter {...iconMargin} count={counter} />}
    </span>
  );
};

export default ButtonLinkContent;
