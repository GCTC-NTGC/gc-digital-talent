import React from "react";
import { Link as RouterLink } from "react-router-dom";

import sanitizeUrl from "../../helpers/sanitizeUrl";

import "./cardLink.css";

export type Color = "ts-primary" | "ia-primary" | "ia-secondary";

export interface CardLinkProps {
  href: string;
  label: string;
  color?: Color;
  icon?: React.FC<{ className: string }>;
  className?: string;
  external?: boolean;
  children?: React.ReactNode;
}

export const colorMap: Record<Color, Record<string, string>> = {
  "ts-primary": {
    "data-h2-background-color": "base(dt-secondary.light)",
    "data-h2-color": "base(dt-white)",
  },
  "ia-primary": {
    "data-h2-background": "base(ia-linear-secondary)",
    "data-h2-color": "base(ia-white)",
  },
  "ia-secondary": {
    "data-h2-background": "base(ia-linear-primary)",
    "data-h2-color": "base(ia-white)",
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
    "data-h2-shadow": "base(m) base:hover(xl)",
    "data-h2-transition": "base:hover(box-shadow, .2s, ease, 0s)",
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

const CardLink: React.FC<CardLinkProps> = ({
  href,
  color = "ts-primary",
  external,
  icon,
  label,
  children,
}) => {
  const Icon = icon || null;
  const url = sanitizeUrl(href);
  return (
    <Link href={url || "#"} external={!!external}>
      <span
        className="card-link__header"
        data-h2-display="base(block)"
        data-h2-font-size="base(h4, 1) desktop(h3, 1)"
        data-h2-font-weight="base(700)"
        data-h2-padding="base(x1)"
        data-h2-radius="base(s, s, 0px, 0px)"
        {...{ ...colorMap[color] }}
      >
        {children}
      </span>
      <span
        className="card-link__label"
        data-h2-background-color="base(dt-white)"
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-justify-content="base(flex-start)"
        data-h2-radius="base(0, 0, s, s)"
        data-h2-padding="base(x1)"
      >
        {Icon && <Icon className="card-link__icon" />}
        <span>{label}</span>
      </span>
    </Link>
  );
};

export default CardLink;
