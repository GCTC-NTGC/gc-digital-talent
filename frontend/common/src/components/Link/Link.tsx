import React from "react";
import { navigate } from "../../helpers/router";

export const Link: React.FC<{ href: string; title: string }> = ({
  href,
  title,
  children,
  ...rest
}): React.ReactElement => (
  <a
    href={href}
    title={title}
    {...rest}
    onClick={(event): void => {
      event.preventDefault();
      navigate(href);
    }}
  >
    {children}
  </a>
);

export default Link;
