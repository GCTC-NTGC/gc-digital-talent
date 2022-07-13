import React from "react";
import { navigate } from "../../helpers/router";
import sanitizeUrl from "../../helpers/sanitizeUrl";
import type { Color } from "../Button";
import { colorMap } from "../Button/Button";

export interface LinkProps extends React.HTMLProps<HTMLAnchorElement> {
  /** The style colour of the link */
  color?: Color;
  /** The style mode of the element. */
  mode?: "solid" | "outline" | "inline";
  block?: boolean;
  type?: "button" | "link";
  /** For use when linking to a domain outside of the application */
  external?: boolean;
}

const Link: React.FC<LinkProps> = ({
  href,
  title,
  color,
  disabled,
  mode = "solid",
  block = false,
  external = false,
  type = "link",
  children,
  className,
  ...rest
}): React.ReactElement => {
  const url = sanitizeUrl(href);
  return (
    <a
      href={url}
      title={title}
      className={`${type === "button" && `button `}${className}`}
      {...(type === "button"
        ? {
            "data-h2-radius": "base(s)",
            "data-h2-padding": "base(x.5, x1)",
            "data-h2-font-size": "base(copy)",
            ...(disabled && { style: { opacity: 0.6, pointerEvents: "none" } }),
            ...(color && mode ? { ...colorMap[color][mode] } : {}),
            ...(block
              ? {
                  "data-h2-display": "base(block)",
                  "data-h2-text-align": "base(center)",
                }
              : { "data-h2-display": "base(inline-block)" }),
          }
        : {})}
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
      {children}
    </a>
  );
};

export default Link;
