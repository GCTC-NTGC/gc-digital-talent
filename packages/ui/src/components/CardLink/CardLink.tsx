import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { sanitizeUrl } from "@gc-digital-talent/helpers";

import { IconType } from "../../types";
import "./cardLink.css";

type Color =
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "quinary"
  | "black"
  | "white";

export interface CardLinkProps {
  href: string;
  label: string;
  color?: Color;
  icon?: IconType;
  external?: boolean;
  children?: React.ReactNode;
  subtitle?: string;
}

const colorMap: Record<Color, Record<string, string>> = {
  primary: {
    "data-h2-background-color": "base:all(primary.light) base:iap:all(primary)",
    "data-h2-color":
      "base:all(black) base:all:admin(white) base:all:iap(white)",
  },
  secondary: {
    "data-h2-background-color":
      "base(secondary) base:dark:admin(secondary.lighter) base:iap:dark(secondary.light)",
    "data-h2-color":
      "base:all(black) base:all:admin(white) base:all:iap(white)",
  },
  tertiary: {
    "data-h2-background-color":
      "base:all(tertiary.light) base:iap(secondary) base:dark:iap(tertiary.light)",
    "data-h2-color": "base:all(black) base:all:iap(white)",
  },
  quaternary: {
    "data-h2-background-color":
      "base:all(quaternary.light) base:iap(secondary) base:dark:iap(quaternary.light)",
    "data-h2-color": "base:all(black) base:all:iap(white)",
  },
  quinary: {
    "data-h2-background-color": "base(quinary) base:dark:iap(quinary.light)",
    "data-h2-color": "base:all(black) base:all:iap(white)",
  },
  black: {
    "data-h2-background-color":
      "base(gray.darkest) base:dark(foreground.shade)",
    "data-h2-color": "base:all(white)",
  },
  white: {
    "data-h2-background-color": "base(foreground) base:dark(foreground.tint)",
    "data-h2-color": "base:all(black)",
  },
};

interface LinkProps {
  href: string;
  external: boolean;
  children: React.ReactNode;
  subtitle?: string;
}

const Link = ({ href, external, children }: LinkProps) => {
  const linkProps = {
    className: "card-link",
    "data-h2-display": "base(inline-block)",
    "data-h2-radius": "base(s)",
    "data-h2-shadow": "base(medium) base:hover(larger)",
    "data-h2-transition": "base:hover(box-shadow .2s ease 0s)",
  };

  if (external) {
    return (
      // NOTE: We do want to allow external links to be rendered as <a> tags
      // eslint-disable-next-line react/forbid-elements
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

const CardLink = ({
  href,
  color = "primary",
  external,
  icon,
  label,
  children,
  subtitle,
}: CardLinkProps) => {
  const Icon = icon || null;
  const url = sanitizeUrl(href);
  return (
    <Link href={url || "#"} external={!!external}>
      <div
        data-h2-background-color="base(foreground)"
        data-h2-min-height="base(100%)"
        data-h2-radius="base(rounded)"
        data-h2-overflow="base(hidden)"
      >
        <div
          className="card-link__header"
          data-h2-display="base:children[>span](block)"
          data-h2-padding="base(x1)"
          {...{ ...colorMap[color] }}
        >
          <span data-h2-font-size="base(h6, 1)" data-h2-font-weight="base(700)">
            {children}
          </span>
          {subtitle && <span data-h2-margin="base(x.5 0 0 0)">{subtitle}</span>}
        </div>
        <span
          className="card-link__label"
          data-h2-display="base(flex)"
          data-h2-align-items="base(center)"
          data-h2-justify-content="base(flex-start)"
          data-h2-padding="base(x1)"
          data-h2-color="base(black)"
        >
          {Icon && <Icon className="card-link__icon" />}
          <span>{label}</span>
        </span>
      </div>
    </Link>
  );
};

export default CardLink;
