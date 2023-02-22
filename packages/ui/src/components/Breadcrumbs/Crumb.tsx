import React from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

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
            "data-h2-text-decoration": "base(none)",
            "aria-current": "page",
          }
        : {})}
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
      >
        <ChevronRightIcon />
      </span>
    )}
  </li>
);

export default Crumb;
