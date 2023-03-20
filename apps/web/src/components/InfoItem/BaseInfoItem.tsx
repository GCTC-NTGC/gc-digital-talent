import * as React from "react";
import Link from "@gc-digital-talent/ui/src/components/Link";

export type TextColor = "default" | "error" | "success";
const textColorMap: Record<TextColor, Record<string, string>> = {
  default: {
    "data-h2-color": "base:all(black)",
  },
  error: {
    "data-h2-color": "base:all(error.darker)",
  },
  success: {
    "data-h2-color": "base:all(success)",
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
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  iconColor?: IconColor;
  titleHref?: string;
  hiddenContextPrefix?: string;
}

export const BaseInfoItem = ({
  title,
  titleColor = "default",
  subTitle,
  subTitleColor = "default",
  icon,
  iconColor = "success",
  titleHref,
  hiddenContextPrefix,
}: BaseInfoItemProps) => {
  const Icon = icon;

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
    <li
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

      <div>
        {titleHref ? (
          <Link href={titleHref} {...{ ...textColorMap[titleColor] }}>
            {combinedTitle}
          </Link>
        ) : (
          <p {...{ ...textColorMap[titleColor] }}>{combinedTitle}</p>
        )}

        <p
          data-h2-font-size="base(caption)"
          data-h2-text-decoration="base(none)"
          {...{ ...textColorMap[subTitleColor] }}
        >
          {subTitle}
        </p>
      </div>
    </li>
  );
};
