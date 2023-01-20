import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/solid";

import type { Color } from "../Button";
import sanitizeUrl from "../../helpers/sanitizeUrl";

const colorMap: Record<Color, Record<string, string>> = {
  primary: {
    "data-h2-border-left": "base(.5rem solid dt-primary)",
  },
  secondary: {
    "data-h2-border-left": "base(.5rem solid dt-secondary)",
  },
  cta: {
    "data-h2-border-left": "base(.5rem solid dt-accent.dark)",
  },
  white: {
    "data-h2-border-left": "base(.5rem solid dt-white)",
  },
  black: {
    "data-h2-border-left": "base(.5rem solid dt-black)",
  },
  "ia-primary": {
    "data-h2-border-left": "base(.5rem solid ia-primary)",
  },
  "ia-secondary": {
    "data-h2-border-left": "base(.5rem solid ia-secondary)",
  },
  yellow: {
    "data-h2-border-left": "base(.5rem solid tm-yellow)",
  },
  red: {
    "data-h2-border-left": "base(.5rem solid tm-red)",
  },
  blue: {
    "data-h2-border-left": "base(.5rem solid tm-blue)",
  },
  purple: {
    "data-h2-border-left": "base(.5rem solid tm-purple)",
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
    "data-h2-background-color": "base(dt-white)",
    "data-h2-display": "base(flex)",
    "data-h2-align-items": "base(flex-end)",
    "data-h2-shadow": "base(m) base:hover(xl)",
    "data-h2-padding": "base(x.5)",
    "data-h2-justify-content": "base(space-between)",
    "data-h2-transition": "base(box-shadow, .2s, ease, 0s)",
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

const TileLink: React.FC<TileLinkProps> = ({
  href,
  color,
  external,
  children,
  ...rest
}): React.ReactElement => {
  const url = sanitizeUrl(href);
  return (
    <Link href={url || "#"} external={external} color={color} {...rest}>
      <span
        data-h2-display="base(block)"
        data-h2-overflow="base(hidden)"
        data-h2-padding="base(x3, 0, 0, 0)"
        data-h2-width="base(100%)"
        style={{
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
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
