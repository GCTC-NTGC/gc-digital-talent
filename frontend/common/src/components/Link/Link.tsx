import React from "react";
import { navigate } from "../../helpers/router";

export const Link: React.FC<{ href: string; title: string }> = ({
  href,
  title,
  children,
  ...props
}): React.ReactElement => (
  <a
    href={href}
    title={title}
    {...props}
    onClick={(event): void => {
      event.preventDefault();
      navigate(href);
    }}
  >
    {children}
  </a>
);

export default Link;
