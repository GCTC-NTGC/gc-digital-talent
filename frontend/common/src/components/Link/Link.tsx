import React from "react";
import sanitizeUrl from "../../helpers/sanitizeUrl";
import type { Color } from "../Button";
import useCommonLinkStyles from "./useCommonLinkStyles";
import useLinkClickHandler from "./useLinkClickHandler";

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
  external,
  mode = "solid",
  block = false,
  type = "link",
  children,
  className,
  ...rest
}): React.ReactElement => {
  const url = sanitizeUrl(href);
  const clickHandler = useLinkClickHandler({
    to: url || "#",
  });
  const styles = useCommonLinkStyles({ color, disabled, mode, block, type });
  return (
    <a
      href={url}
      title={title}
      className={`${type === "button" && `button `}${className}`}
      {...(!external
        ? {
            onClick: clickHandler,
          }
        : null)}
      {...styles}
      {...rest}
    >
      {children}
    </a>
  );
};

export default Link;
