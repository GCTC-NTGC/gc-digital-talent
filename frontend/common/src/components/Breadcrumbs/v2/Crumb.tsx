import React from "react";

interface CrumbProps {
  children: React.ReactNode;
  isCurrent?: boolean;
  url: string;
}

const Crumb = ({ children, isCurrent, url }: CrumbProps) => (
  <li>
    <a
      href={url}
      {...(isCurrent
        ? {
            "data-h2-font-weight": "base(700)",
            "data-h2-text-decoration": "base(none)",
            "aria-current": "page",
          }
        : {})}
    >
      {children}
    </a>
    {!isCurrent && (
      <span
        aria-hidden="true"
        data-h2-display="base(inline-block)"
        data-h2-margin="base(0, 0, 0, x.5)"
      >
        /
      </span>
    )}
  </li>
);

export default Crumb;
