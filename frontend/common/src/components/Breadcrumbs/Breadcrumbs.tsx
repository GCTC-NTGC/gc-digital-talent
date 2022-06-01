import React, { Fragment } from "react";
import { ChevronRightIcon } from "@heroicons/react/solid";
import Link from "../Link";

export interface BreadcrumbsProps {
  links: { title: string; href?: string; icon?: JSX.Element }[];
}

const Breadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({ links }) => (
  <div data-h2-display="b(flex)">
    {links.map((link, index) => (
      <Fragment key={link.title}>
        {index > 0 && (
          <span
            data-h2-padding="b(right-left, xs)"
            data-h2-display="b(flex)"
            data-h2-align-items="b(center)"
          >
            <ChevronRightIcon style={{ width: "1.4rem" }} />
          </span>
        )}
        {link.href ? (
          <Link
            data-h2-display="b(flex)"
            data-h2-align-items="b(center)"
            href={link.href}
            title={link.title}
            key={link.title}
          >
            {link.icon || ""} {link.title}
          </Link>
        ) : (
          <span
            data-h2-display="b(flex)"
            data-h2-align-items="b(center)"
            data-h2-font-weight="b(700)"
            key={link.title}
          >
            {link.icon || ""} {link.title}
          </span>
        )}
      </Fragment>
    ))}
  </div>
);

export default Breadcrumbs;
