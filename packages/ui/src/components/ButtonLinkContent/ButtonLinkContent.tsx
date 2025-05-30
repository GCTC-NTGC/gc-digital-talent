import ArrowTopRightOnSquareIcon from "@heroicons/react/20/solid/ArrowTopRightOnSquareIcon";
import { useIntl } from "react-intl";
import { DetailedHTMLProps, HTMLAttributes } from "react";

import { uiMessages } from "@gc-digital-talent/i18n";

import { ButtonLinkMode, IconType } from "../../types";
import Counter from "../Button/Counter";

interface IconTextProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  mode: ButtonLinkMode;
  fontSize?:
    | "display"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body"
    | "caption";
  icon?: IconType;
  counter?: number;
  utilityIcon?: IconType;
  newTab?: boolean;
  noUnderline?: boolean;
}

const ButtonLinkContent = ({
  children,
  icon,
  counter,
  utilityIcon,
  mode,
  fontSize,
  newTab = false,
  noUnderline = false,
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
      "data-h2-width": "base(x.85)",
    };
  } else if (fontSize === "h5") {
    textSize = {
      "data-h2-font-size": "base(h5)",
    };
    iconSize = {
      "data-h2-width": "base(x.95)",
    };
  } else if (fontSize === "h4") {
    textSize = {
      "data-h2-font-size": "base(h4)",
    };
    iconSize = {
      "data-h2-width": "base(x1.15)",
    };
  } else if (fontSize === "h3") {
    textSize = {
      "data-h2-font-size": "base(h3)",
    };
    iconSize = {
      "data-h2-width": "base(x1.35)",
    };
  } else if (fontSize === "h2") {
    textSize = {
      "data-h2-font-size": "base(h2)",
    };
    iconSize = {
      "data-h2-width": "base(x1.65)",
    };
  } else if (fontSize === "h1") {
    textSize = {
      "data-h2-font-size": "base(h1)",
    };
    iconSize = {
      "data-h2-width": "base(x2)",
    };
  } else if (fontSize === "display") {
    textSize = {
      "data-h2-font-size": "base(display)",
    };
    iconSize = {
      "data-h2-width": "base(x2.35)",
    };
  }
  let iconMargin = {
    "data-h2-margin-top": "base(0)",
  };
  if (mode === "text" && fontSize !== "caption") {
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
      <span
        {...textSize}
        {...(noUnderline
          ? {}
          : { "data-h2-text-decoration": "base(underline)" })}
      >
        {children}
      </span>
    );
  const Icon = icon;
  const UtilityIcon = utilityIcon;

  return (
    <span {...contentDisplay} {...rest}>
      {Icon && (
        <Icon
          data-h2-margin-right="base(x.25)"
          data-h2-display="base(inline)"
          {...iconSize}
          {...iconMargin}
        />
      )}
      <span
        {...textSize}
        {...(noUnderline
          ? {}
          : { "data-h2-text-decoration": "base(underline)" })}
      >
        {children}
      </span>
      {UtilityIcon && (
        <UtilityIcon
          {...iconSize}
          {...iconMargin}
          data-h2-display="base(inline)"
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
