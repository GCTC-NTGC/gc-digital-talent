import React, { Fragment } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import Link from "../Link";

export interface BreadcrumbsProps {
  links: { title: string; href?: string; icon?: JSX.Element }[];
}

const Breadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({ links }) => {
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
  const previousStep = links[links.length - 2];

  // create an event listener
  React.useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  return (
    <div data-h2-display="b(flex)">
      {isMobile && previousStep ? (
        <>
          <span
            data-h2-padding="b(right-left, xs)"
            data-h2-display="b(flex)"
            data-h2-align-items="b(center)"
          >
            <ChevronLeftIcon style={{ width: "1.4rem" }} />
          </span>
          <Link
            data-h2-display="b(flex)"
            data-h2-align-items="b(center)"
            href={previousStep.href}
            key={previousStep.title}
          >
            {previousStep.icon || ""} {previousStep.title}
          </Link>
        </>
      ) : (
        links.map((link, index) => (
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
        ))
      )}
    </div>
  );
};

export default Breadcrumbs;
