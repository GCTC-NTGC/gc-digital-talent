import { ChevronDoubleRightIcon } from "@heroicons/react/solid";
import React from "react";
import { navigate } from "../../helpers/router";
import type { Color } from "../Button";
import sanitizeUrl from "../../helpers/sanitizeUrl";
import useLinkClickHandler from "../Link/useLinkClickHandler";

const colorMap: Record<Color, Record<string, string>> = {
  primary: {
    "data-h2-border": "b(lightpurple, left, solid, m)",
  },
  secondary: {
    "data-h2-border": "b(lightnavy, left, solid, m)",
  },
  cta: {
    "data-h2-border": "b(darkgold, left, solid, m)",
  },
  white: {
    "data-h2-border": "b(white, left, solid, m)",
  },
  black: {
    "data-h2-border": "b(black, left, solid, m)",
  },
  "ia-primary": {
    "data-h2-border": "b(ia-pink, left, solid, m)",
  },
  "ia-secondary": {
    "data-h2-border": "b(ia-purple, left, solid, m)",
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
}): React.ReactElement => {
  const url = sanitizeUrl(href);
  const clickHandler = useLinkClickHandler({
    to: url || "#",
  });
  return (
    <a
      href={href}
      title={title}
      data-h2-bg-color="b(white) b:h(lightgray)"
      data-h2-display="b(flex)"
      data-h2-align-items="b(flex-end)"
      data-h2-shadow="b(m)"
      data-h2-padding="b(all, s)"
      data-h2-justify-content="b(space-between)"
      {...colorMap[color]}
      {...rest}
      onClick={clickHandler}
    >
      <span
        data-h2-display="b(block)"
        data-h2-overflow="b(all, hidden)"
        data-h2-padding="b(top, xl)"
        data-h2-width="b(100)"
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
