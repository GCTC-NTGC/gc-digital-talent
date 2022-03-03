import React from "react";
import Link from "../Link";

export interface BreadcrumbsProps {
  links: { title: string; href: string }[];
}

const Breadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({ links }) => {
  const arrayLinks = links.map((link, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Link href={link.href} title={link.title} key={index}>
      {link.title}
    </Link>
  ));

  return <div data-h2-display="b(flex)">{arrayLinks}</div>;
};

export default Breadcrumbs;
