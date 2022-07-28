import React, { Fragment } from "react";
import { ChevronRightIcon } from "@heroicons/react/solid";
import Link from "../Link";

export interface BreadcrumbsProps {
  links: { title: string; href?: string; icon?: JSX.Element }[];
}

const Breadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({ links }) => (
  <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
    <div data-h2-display="base(flex)">
      {links.map((link, index) => (
        <Fragment key={link.title}>
          {index > 0 && (
            <span
              data-h2-padding="base(0, x.25)"
              data-h2-display="base(flex)"
              data-h2-align-items="base(center)"
            >
              <ChevronRightIcon style={{ width: "1.4rem" }} />
            </span>
          )}
          {link.href ? (
            <Link
              data-h2-display="base(flex)"
              data-h2-align-items="base(center)"
              href={link.href}
              key={link.title}
            >
              {link.icon || ""} {link.title}
            </Link>
          ) : (
            <span
              data-h2-display="base(flex)"
              data-h2-align-items="base(center)"
              data-h2-font-weight="base(700)"
              key={link.title}
            >
              {link.icon || ""} {link.title}
            </span>
          )}
        </Fragment>
      ))}
    </div>
  </div>
);

export default Breadcrumbs;
