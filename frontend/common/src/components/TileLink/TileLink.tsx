import { ChevronDoubleRightIcon } from "@heroicons/react/solid";
import React from "react";
import { navigate } from "../../helpers/router";
import type { Color } from "../Button";

const colorMap: Record<Color, Record<string, string>> = {
  primary: {
    "data-h2-border": "b(left, .5rem, solid, dt-primary)",
  },
  secondary: {
    "data-h2-border": "b(left, .5rem, solid, dt-primary) b(lightnavy, left, solid, m)",
  },
  cta: {
    "data-h2-border": "b(left, .5rem, solid, dark.dt-accent)",
  },
  white: {
    "data-h2-border": "b(left, .5rem, solid, dt-white)",
  },
  black: {
    "data-h2-border": "b(left, .5rem, solid, dt-black)",
  },
  "ia-primary": {
    "data-h2-border": "b(left, .5rem, solid, ia-primary)",
  },
  "ia-secondary": {
    "data-h2-border": "b(left, .5rem, solid, ia-secondary)",
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
  children,
  external = false,
  ...rest
}): React.ReactElement => (
  <a
    href={href}
    title={title}
    data-h2-background-color="b(dt-white) b:hover(light.dt-gray)"
    data-h2-display="b(flex)"
    data-h2-align-items="b(flex-end)"
    data-h2-shadow="b(m)"
    data-h2-padding="b(x.5)"
    data-h2-justify-content="b(space-between)"
    {...colorMap[color]}
    {...rest}
    onClick={
      !external
        ? (event): void => {
            event.preventDefault();
            if (href) navigate(href);
          }
        : undefined
    }
  >
    <span
      data-h2-display="b(block)"
      data-h2-overflow="b(hidden, all)"
      data-h2-padding="b(x3, 0, 0, 0)"
      data-h2-width="b(100%)"
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

export default TileLink;
