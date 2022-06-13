import React from "react";
import { navigate } from "../../helpers/router";

import "./cardLink.css";

export type Color = "ts-primary" | "ia-primary" | "ia-secondary";

export interface CardLinkProps {
  href: string;
  label: string;
  color?: Color;
  icon?: React.FC<{ className: string }>;
  className?: string;
  external?: boolean;
}

export const colorMap: Record<Color, Record<string, string>> = {
  "ts-primary": {
    "data-h2-background-color": "b(dt-linear)",
    "data-h2-color": "b(dt-white)",
  },
  "ia-primary": {
    "data-h2-background-color": "b(ia-linear-secondary)",
    "data-h2-color": "b(ia-white)",
  },
  "ia-secondary": {
    "data-h2-background-color": "b(ia-linear-primary)",
    "data-h2-color": "b(ia-white)",
  },
};

const CardLink: React.FC<CardLinkProps> = ({
  href,
  color = "ts-primary",
  icon,
  label,
  external = false,
  children,
  ...rest
}) => {
  const Icon = icon || null;
  return (
    <a
      href={href}
      onClick={
        !external
          ? (event): void => {
              event.preventDefault();
              if (href) navigate(href);
            }
          : undefined
      }
      className="card-link"
      data-h2-display="b(inline-block)"
      data-h2-radius="b(s)"
      data-h2-shadow="b(s) b:h(l)"
      {...rest}
    >
      <span
        className="card-link__header"
        data-h2-display="b(block)"
        data-h2-font-size="b(h4) l(h3)"
        data-h2-font-weight="b(800)"
        data-h2-padding="b(x.5)"
        data-h2-radius="b(s, s, 0px, 0px)"
        {...{ ...colorMap[color] }}
      >
        {children}
      </span>
      <span
        className="card-link__label"
        data-h2-background-color="b(dt-white)"
        data-h2-display="b(flex)"
        data-h2-align-items="b(center)"
        data-h2-justify-content="b(flex-start)"
        data-h2-radius="b(0, 0, s, s)"
        data-h2-padding="b(x.5)"
      >
        {Icon && <Icon className="card-link__icon" />}
        <span>{label}</span>
      </span>
    </a>
  );
};

export default CardLink;
