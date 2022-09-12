import { ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import React from "react";
import type { Color } from "../Button";
import sanitizeUrl from "../../helpers/sanitizeUrl";
import useLinkClickHandler from "../Link/useLinkClickHandler";

const colorMap: Record<Color, Record<string, string>> = {
  primary: {
    "data-h2-border": "base(left, .5rem, solid, dt-primary)",
  },
  secondary: {
    "data-h2-border": "base(left, .5rem, solid, dt-secondary)",
  },
  cta: {
    "data-h2-border": "base(left, .5rem, solid, dark.dt-accent)",
  },
  white: {
    "data-h2-border": "base(left, .5rem, solid, dt-white)",
  },
  black: {
    "data-h2-border": "base(left, .5rem, solid, dt-black)",
  },
  "ia-primary": {
    "data-h2-border": "base(left, .5rem, solid, ia-primary)",
  },
  "ia-secondary": {
    "data-h2-border": "base(left, .5rem, solid, ia-secondary)",
  },
};

export interface TileLinkProps extends React.HTMLProps<HTMLAnchorElement> {
  /** The style colour of the link */
  color: Color;
  /** Use if link goes to a URL outside of the application */
  external?: boolean;
}

const TileLink: React.FC<TileLinkProps> = ({
  href,
  title,
  color,
  external,
  children,
  ...rest
}): React.ReactElement => {
  const url = sanitizeUrl(href);
  const clickHandler = useLinkClickHandler({
    to: url || "#",
  });
  return (
    <a
      href={href}
      title={title}
      data-h2-background-color="base(dt-white)"
      data-h2-display="base(flex)"
      data-h2-align-items="base(flex-end)"
      data-h2-shadow="base(m) base:hover(xl)"
      data-h2-padding="base(x.5)"
      data-h2-justify-content="base(space-between)"
      data-h2-transition="base(box-shadow, .2s, ease, 0s)"
      {...colorMap[color]}
      {...rest}
      {...(!external
        ? {
            onClick: clickHandler,
          }
        : null)}
    >
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
    </a>
  );
};

export default TileLink;
