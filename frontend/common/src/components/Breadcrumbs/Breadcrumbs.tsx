import React from "react";
import Link from "../Link";

export interface BreadcrumbsProps {
  links: { title: string; href: string }[];
}

const Breadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({ links }) => {
  // taking in the array of links as defined above, create an array of Link components
  const arrayLinks = links.map((link, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Link href={link.href} title={link.title} key={index}>
      {link.title}
    </Link>
  ));

  // menu requires ">" after each link except the last one
  // provided it is an array of more than one link, build another array of Links except this time add the ">" after every single one with an exception
  // for if you are at the last link in which case do not add anything after it
  let menuBar = [];
  if (arrayLinks.length > 1) {
    for (let i = 0; i < arrayLinks.length; i += 1) {
      if (i < arrayLinks.length - 1) {
        menuBar.push(arrayLinks[i]);
        menuBar.push(<span data-h2-padding="b(right-left, xs)">&gt;</span>);
      } else {
        menuBar.push(arrayLinks[i]);
      }
    }
  } else {
    menuBar = arrayLinks;
  }

  return <div data-h2-display="b(flex)">{menuBar}</div>;
};

export default Breadcrumbs;
