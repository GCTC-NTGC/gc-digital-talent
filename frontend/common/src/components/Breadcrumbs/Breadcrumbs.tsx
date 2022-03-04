import React from "react";
import Link from "../Link";
import { insertBetween } from "../../helpers/util";

export interface BreadcrumbsProps {
  links: { title: string; href?: string }[];
}

const Breadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({ links }) => {
  // taking in the array of objects as defined above, create an array of Link components or a <span> if there is no href
  const arrayLinks = links.map((link, index) =>
    link.href ? (
      // eslint-disable-next-line react/no-array-index-key
      <Link href={link.href} title={link.title} key={index}>
        {link.title}
      </Link>
    ) : (
      // eslint-disable-next-line react/no-array-index-key
      <span data-h2-font-weight="b(700)" key={index}>
        {link.title}
      </span>
    ),
  );

  // add chevrons between links
  const separator = <span data-h2-padding="b(right-left, xs)">&gt;</span>;
  const menuBar = insertBetween(separator, arrayLinks);

  return <div data-h2-display="b(flex)">{menuBar}</div>;
};

export default Breadcrumbs;
