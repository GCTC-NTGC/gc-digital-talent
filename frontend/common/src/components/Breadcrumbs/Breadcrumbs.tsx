import React from "react";
import { ChevronRightIcon } from "@heroicons/react/solid";
import Link from "../Link";
import { insertBetween } from "../../helpers/util";

export interface BreadcrumbsProps {
  links: { title: string; href?: string; icon?: JSX.Element }[];
}

export const Breadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({
  links,
}) => {
  // taking in the array of objects as defined above, create an array of Link components or a <span> if there is no href
  const arrayLinks = links.map((link, index) =>
    link.href ? (
      <Link
        data-h2-display="b(flex)"
        data-h2-align-items="b(center)"
        href={link.href}
        title={link.title}
        // eslint-disable-next-line react/no-array-index-key
        key={index}
      >
        {link.icon || ""} {link.title}
      </Link>
    ) : (
      <span
        data-h2-display="b(flex)"
        data-h2-align-items="b(center)"
        data-h2-font-weight="b(700)"
        // eslint-disable-next-line react/no-array-index-key
        key={index}
      >
        {link.icon || ""} {link.title}
      </span>
    ),
  );

  // add chevrons between links
  const separator = (
    <span
      data-h2-padding="b(right-left, xs)"
      data-h2-display="b(flex)"
      data-h2-align-items="b(center)"
    >
      <ChevronRightIcon style={{ width: "1.4rem" }} />
    </span>
  );
  const menuBar = insertBetween(separator, arrayLinks);

  return <div data-h2-display="b(flex)">{menuBar}</div>;
};

export default Breadcrumbs;
