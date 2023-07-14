import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { sanitizeUrl } from "@gc-digital-talent/helpers";

import { IconType } from "../../types";
import "./cardLink.css";

export type Color =
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "quinary";

export interface CardLinkProps {
  href: string;
  label: string;
  color?: Color;
  icon?: IconType;
  className?: string;
  external?: boolean;
  children?: React.ReactNode;
}

export const colorMap: Record<Color, Record<string, string>> = {
  primary: {
    "data-h2-background-color":
      "base:all(primary.light) base:dark:iap(primary)",
    "data-h2-color":
      "base:all(black) base:all:admin(white) base:all:iap(white)",
  },
  secondary: {
    "data-h2-background-color":
      "base(secondary) base:dark:admin(secondary.lighter) base:dark:iap(secondary.light)",
    "data-h2-color":
      "base:all(black) base:all:admin(white) base:all:iap(white)",
  },
  tertiary: {
    "data-h2-background-color": "base(tertiary) base:dark:iap(tertiary.light)",
    "data-h2-color": "base:all(black) base:all:iap(white)",
  },
  quaternary: {
    "data-h2-background-color":
      "base(quaternary) base:dark:iap(quaternary.light)",
    "data-h2-color": "base:all(black) base:all:iap(white)",
  },
  quinary: {
    "data-h2-background-color": "base(quinary) base:dark:iap(quinary.light)",
    "data-h2-color": "base:all(black) base:all:iap(white)",
  },
};

interface LinkProps {
  href: string;
  external: boolean;
  children: React.ReactNode;
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
}: CardLinkProps) => {
  const Icon = icon || null;
  const url = sanitizeUrl(href);
  return (
    <Link href={url || "#"} external={!!external}>
      <span
        className="card-link__header"
        data-h2-display="base(block)"
        data-h2-font-size="base(h5, 1)"
        data-h2-padding="base(x1)"
        data-h2-radius="base(rounded, rounded, 0px, 0px)"
        {...{ ...colorMap[color] }}
      >
        {children}
      </span>
      <span
        className="card-link__label"
        data-h2-background-color="base(foreground)"
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-justify-content="base(flex-start)"
        data-h2-radius="base(0, 0, rounded, rounded)"
        data-h2-padding="base(x1)"
      >
        {Icon && <Icon className="card-link__icon" />}
        <span>{label}</span>
      </span>
    </Link>
  );
};

export default CardLink;
