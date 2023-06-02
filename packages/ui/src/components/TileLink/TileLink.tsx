import React from "react";
import { Link as RouterLink } from "react-router-dom";
import ChevronDoubleRightIcon from "@heroicons/react/24/solid/ChevronDoubleRightIcon";

import { sanitizeUrl } from "@gc-digital-talent/helpers";

import type { Color } from "../../types";

const colorMap: Record<Color, Record<string, string>> = {
  primary: {
    "data-h2-border-left": "base(x.5 solid primary)",
  },
  secondary: {
    "data-h2-border-left":
      "base(x.5 solid secondary) base:dark:admin(x.5 solid secondary.lighter) base:dark:iap(x.5 solid secondary.light)",
  },
  tertiary: {
    "data-h2-border-left":
      "base(x.5 solid tertiary) base:dark:iap(x.5 solid tertiary.light)",
  },
  quaternary: {
    "data-h2-border-left":
      "base(x.5 solid quaternary) base:dark:iap(x.5 solid quaternary.light)",
  },
  quinary: {
    "data-h2-border-left":
      "base(x.5 solid quinary) base:dark:iap(x.5 solid quinary.light)",
  },
  success: {
    "data-h2-border-left": "base(x.5 solid success)",
  },
  warning: {
    "data-h2-border-left": "base(x.5 solid warning)",
  },
  error: {
    "data-h2-border-left": "base(x.5 solid error)",
  },
  cta: {
    "data-h2-border-left": "base(x.5 solid tertiary.dark)",
  },
  white: {
    "data-h2-border-left": "base(x.5 solid white)",
  },
  black: {
    "data-h2-border-left": "base(x.5 solid black)",
  },
  "ia-primary": {
    "data-h2-border-left": "base(x.5 solid primary)",
  },
  "ia-secondary": {
    "data-h2-border-left": "base(x.5 solid secondary)",
  },
  yellow: {
    "data-h2-border-left": "base(x.5 solid quaternary)",
  },
  red: {
    "data-h2-border-left": "base(x.5 solid tertiary)",
  },
  blue: {
    "data-h2-border-left": "base(x.5 solid secondary)",
  },
  purple: {
    "data-h2-border-left": "base(x.5 solid primary)",
  },
};

export interface TileLinkProps extends React.HTMLProps<HTMLAnchorElement> {
  /** The style colour of the link */
  color: Color;
  /** Use if link goes to a URL outside of the application */
  external?: boolean;
}

interface LinkProps extends Omit<TileLinkProps, "title" | "href" | "ref"> {
  href: string;
}

const Link = ({ href, color, external, children, ...rest }: LinkProps) => {
  const linkProps = {
    "data-h2-background-color": "base(foreground)",
    "data-h2-display": "base(flex)",
    "data-h2-align-items": "base(flex-end)",
    "data-h2-shadow": "base(medium) base:hover(larger)",
    "data-h2-padding": "base(x.5)",
    "data-h2-justify-content": "base(space-between)",
    "data-h2-transition": "base(box-shadow .2s ease 0s)",
    "data-h2-radius": "base(0px, rounded, rounded, 0px)",
    ...colorMap[color],
    ...rest,
  };

  if (external) {
    return (
      <a href={href} {...linkProps}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={href} {...linkProps}>
      {children}
    </RouterLink>
  );
};

const TileLink = ({
  href,
  color,
  external,
  children,
  ...rest
}: TileLinkProps) => {
  const url = sanitizeUrl(href);
  return (
    <Link href={url || "#"} external={external} color={color} {...rest}>
      <span
        data-h2-display="base(block)"
        data-h2-overflow="base(hidden)"
        data-h2-padding="base(x3, 0, 0, 0)"
        data-h2-width="base(100%)"
        data-h2-text-overflow="base(ellipsis)"
        data-h2-white-space="base(nowrap)"
      >
        {children}
      </span>
      <ChevronDoubleRightIcon
        style={{ height: "1rem", width: "1rem", flexShrink: 0 }}
      />
    </Link>
  );
};

export default TileLink;
