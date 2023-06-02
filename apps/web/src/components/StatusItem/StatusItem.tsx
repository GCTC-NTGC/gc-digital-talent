import * as React from "react";

import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";

import { Link, IconType } from "@gc-digital-talent/ui";

export type Status = "error" | "success";
export type StatusColor = "default" | Status;

const textColorMap: Record<StatusColor, Record<string, string>> = {
  default: {
    "data-h2-color": "base(black) base:hover(primary)",
  },
  error: {
    "data-h2-color": "base(error.darker) base:hover(error.darkest)",
  },
  success: {
    "data-h2-color": "base(success) base:hover(success.darker)",
  },
};

const iconColorMap: Record<StatusColor, Record<string, string>> = {
  default: {
    "data-h2-color": "base(black) base:hover(primary)",
  },
  error: {
    "data-h2-color": "base(error)",
  },
  success: {
    "data-h2-color": "base(success)",
  },
};

export interface StatusItemProps {
  title: string;
  titleColor?: StatusColor;
  status?: Status;
  icon?: IconType;
  iconColor?: StatusColor;
  href?: string;
  hiddenContextPrefix?: string;
  asListItem?: boolean;
  itemCount?: number;
}

export const StatusItem = ({
  title,
  titleColor = "default",
  status,
  icon,
  iconColor = "default",
  href,
  hiddenContextPrefix,
  asListItem = true,
  itemCount,
}: StatusItemProps) => {
  let Icon: IconType | null | undefined;
  switch (status) {
    case "error":
      Icon = ExclamationCircleIcon;
      break;
    case "success":
      Icon = CheckCircleIcon;
      break;
    default:
      Icon = icon;
  }

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
      data-h2-border-top="base:selectors[:not(:first-child)](1px solid gray.lighter)"
      data-h2-margin-top="base:selectors[:not(:first-child)](x.5)"
      data-h2-padding-top="base:selectors[:not(:first-child)](x.5)"
      data-h2-justify-content="base(space-between)"
    >
      <span
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(row)"
        data-h2-gap="base(x0.5)"
      >
        {Icon && (
          <Icon
            data-h2-height="base(x.75)"
            data-h2-width="base(x.75)"
            data-h2-min-width="base(x.75)"
            data-h2-margin-top="base(x.15)"
            data-h2-transition="base(color .2s ease)"
            {...iconColorMap[status ?? iconColor]}
          />
        )}

        <span>
          {href ? (
            <Link href={href} {...{ ...textColorMap[titleColor] }}>
              {combinedTitle}
            </Link>
          ) : (
            <span {...{ ...textColorMap[titleColor] }}>{combinedTitle}</span>
          )}
        </span>
      </span>

      {itemCount && <span>{itemCount}</span>}
    </Wrapper>
  );
};

export default StatusItem;
