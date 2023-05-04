import React from "react";
import { Link } from "react-router-dom";
import ChevronRightIcon from "@heroicons/react/24/solid/ChevronRightIcon";

interface CrumbProps {
  children: React.ReactNode;
  isCurrent?: boolean;
  url: string;
}

const Crumb = ({ children, isCurrent, url }: CrumbProps) => (
  <li>
    <Link
      to={url}
      {...(isCurrent
        ? {
            "data-h2-font-weight": "base(700)",
            "data-h2-text-decoration": "base(none) base:hover(underline)",
            "aria-current": "page",
          }
        : {
            "data-h2-text-decoration": "base:hover(none)",
          })}
    >
      {children}
    </Link>
    {!isCurrent && (
      <span
        aria-hidden="true"
        data-h2-height="base(x1)"
        data-h2-width="base(x1)"
        data-h2-display="base(inline-block)"
        data-h2-margin="base(0, 0, 0, x.5)"
        data-h2-vertical-align="base(middle)"
        data-h2-stroke="base(tertiary)"
      >
        <ChevronRightIcon />
      </span>
    )}
  </li>
);

export default Crumb;
