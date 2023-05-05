import * as React from "react";
import Link from "@gc-digital-talent/ui/src/components/Link";

export type TextColor = "default" | "subtitle" | "error" | "success";
const textColorMap: Record<TextColor, Record<string, string>> = {
  default: {
    "data-h2-color": "base(black) base:hover(primary)",
  },
  subtitle: {
    "data-h2-color": "base(black)",
  },
  error: {
    "data-h2-color": "base(error.darker) base:hover(error.darkest)",
  },
  success: {
    "data-h2-color": "base(success) base:hover(success.darker)",
  },
};

export type IconColor =
  | "default"
  | "gray"
  | "error"
  | "success"
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "quinary";
const iconColorMap: Record<IconColor, Record<string, string>> = {
  default: {
    "data-h2-color": "base(black)",
  },
  gray: {
    "data-h2-color": "base(gray.darker)",
  },
  error: {
    "data-h2-color": "base(error)",
  },
  success: {
    "data-h2-color": "base(success)",
  },
  primary: {
    "data-h2-color": "base(gray.darker) base:hover(primary)",
  },
  secondary: {
    "data-h2-color": "base(gray.darker) base:hover(secondary)",
  },
  tertiary: {
    "data-h2-color": "base(gray.darker) base:hover(tertiary)",
  },
  quaternary: {
    "data-h2-color": "base(gray.darker) base:hover(quaternary)",
  },
  quinary: {
    "data-h2-color": "base(gray.darker) base:hover(quinary)",
  },
};

export interface BaseInfoItemProps {
  title: string;
  titleColor?: TextColor;
  subTitle?: string;
  subTitleColor?: TextColor;
  icon?: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  iconColor?: IconColor;
  titleHref?: string;
  hiddenContextPrefix?: string;
  asListItem?: boolean;
}

export const BaseInfoItem = ({
  title,
  titleColor = "default",
  subTitle,
  subTitleColor = "subtitle",
  icon,
  iconColor = "success",
  titleHref,
  hiddenContextPrefix,
  asListItem = true,
}: BaseInfoItemProps) => {
  const Icon = icon;
  const Wrapper = asListItem ? "li" : "span";

  // combine the context prefix for a11y if available
  const combinedTitle = (
    <>
      {hiddenContextPrefix ? (
        <span data-h2-visually-hidden="base(invisible)">
          {`${hiddenContextPrefix} - `}
        </span>
      ) : null}
      {title}
    </>
  );

  return (
    <Wrapper
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(row)"
      data-h2-gap="base(x0.5)"
      data-h2-border-top="base:selectors[:not(:first-child)](1px solid gray.lighter)"
      data-h2-margin-top="base:selectors[:not(:first-child)](x.5)"
      data-h2-padding-top="base:selectors[:not(:first-child)](x.5)"
    >
      {Icon && (
        <Icon
          data-h2-height="base(x.75)"
          data-h2-width="base(x.75)"
          data-h2-min-width="base(x.75)"
          data-h2-margin-top="base(x.15)"
          data-h2-transition="base(color .2s ease)"
          {...iconColorMap[iconColor]}
        />
      )}

      <span data-h2-display="base(flex)" data-h2-flex-direction="base(column)">
        {titleHref ? (
          <Link href={titleHref} {...{ ...textColorMap[titleColor] }}>
            {combinedTitle}
          </Link>
        ) : (
          <span {...{ ...textColorMap[titleColor] }}>{combinedTitle}</span>
        )}

        <span
          data-h2-font-size="base(caption)"
          data-h2-text-decoration="base(none)"
          {...{ ...textColorMap[subTitleColor] }}
        >
          {subTitle}
        </span>
      </span>
    </Wrapper>
  );
};
