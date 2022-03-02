import React from "react";

export interface BreadcrumbsProps {
  links: [];
}

const Breadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({ links }) => {
  const arrayLinks = links.map((link) => (
    <a
      href={link.link}
      key={Math.random().toString()}
      data-h2-padding="b(right, l)"
    >
      {link.name}
    </a>
  ));

  return <div data-h2-display="b(flex)">{arrayLinks}</div>;
};

export default Breadcrumbs;
