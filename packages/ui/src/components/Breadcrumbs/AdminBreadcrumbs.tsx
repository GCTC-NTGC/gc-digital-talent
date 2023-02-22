import React, { Fragment } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import Link from "../Link";

import { BreadcrumbsProps } from "./Breadcrumbs";

const AdminBreadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({
  crumbs,
}) => {
  const MOBILE_WIDTH = 768;
  const [isMobile, setIsMobile] = React.useState(false);

  // choose the screen size
  const handleResize = () => {
    if (window.innerWidth < MOBILE_WIDTH) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };
  const previousStep = crumbs[crumbs.length - 2];

  // create an event listener
  React.useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  return (
    <div data-h2-display="base(flex)">
      {isMobile && previousStep ? (
        <>
          <span
            data-h2-padding="base(0, x.5)"
            data-h2-display="base(flex)"
            data-h2-align-items="base(center)"
          >
            <ChevronLeftIcon style={{ width: "1rem" }} />
          </span>
          <Link
            data-h2-display="base(flex)"
            data-h2-align-items="base(center)"
            href={previousStep.url}
            key={previousStep.url}
          >
            {previousStep.label}
          </Link>
        </>
      ) : (
        crumbs.map((link, index) => {
          const isCurrent = index + 1 === crumbs.length;
          return (
            <Fragment key={link.url}>
              {index > 0 && (
                <span
                  data-h2-padding="base(0, x.25)"
                  data-h2-display="base(flex)"
                  data-h2-align-items="base(center)"
                >
                  <ChevronRightIcon style={{ width: "1rem" }} />
                </span>
              )}
              <Link
                data-h2-display="base(flex)"
                data-h2-align-items="base(center)"
                href={link.url}
                key={link.url}
                {...(isCurrent
                  ? {
                      "data-h2-font-weight": "base(700)",
                      "data-h2-text-decoration": "base(none)",
                      "aria-current": "page",
                    }
                  : {})}
              >
                {link.label}
              </Link>
            </Fragment>
          );
        })
      )}
    </div>
  );
};

export default AdminBreadcrumbs;
