import { Link } from "react-router";
import ChevronRightIcon from "@heroicons/react/24/solid/ChevronRightIcon";
import { ReactNode } from "react";

interface CrumbProps {
  children: ReactNode;
  isCurrent?: boolean;
  url: string;
}

const Crumb = ({ children, isCurrent, url }: CrumbProps) => (
  <li>
    <Link
      to={url}
      data-h2-color="base:all(white) base:all:hover(secondary.lighter) base:all:focus-visible(black) base:iap:all:hover(secondary.lightest) base:iap:all:focus-visible(black)"
      data-h2-background-color="base:all:focus-visible(focus)"
      data-h2-outline="base(none)"
      data-h2-font-size="base(caption)"
      {...(isCurrent
        ? {
            "data-h2-font-weight": "base(700)",
            "data-h2-text-decoration": "base(none)",
            "aria-current": "page",
            reloadDocument: true,
          }
        : {})}
    >
      {children}
    </Link>
    {!isCurrent && (
      <span
        aria-hidden="true"
        data-h2-height="base(x1.1)"
        data-h2-width="base(x.5)"
        data-h2-display="base(inline-flex)"
        data-h2-align-items="base(center)"
        data-h2-margin="base(0, 0, 0, x.5)"
        data-h2-vertical-align="base(middle)"
        data-h2-stroke="base:children[svg, svg path](tertiary.light) base:iap:all:children[svg, svg path](primary.light)"
        data-h2-fill="base:children[svg, svg path](tertiary.light) base:iap:all:children[svg, svg path](primary.light)"
      >
        <ChevronRightIcon
          data-h2-vertical-align="base(middle)"
          data-h2-height="base(x.5)"
          data-h2-width="base(x.5)"
        />
      </span>
    )}
  </li>
);

export default Crumb;
