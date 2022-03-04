import React from "react";
import Link from "../Link";
import { insertBetween } from "../../helpers/util";

export interface BreadcrumbsProps {
  links: { title: string; href?: string }[];
  fontColor: "white" | "black";
}

// take the argument passed in for fontColor and return a hydrogen-attribute string, options are only white or black
const fontColorExtract = (fontColor?: string) => {
  if (fontColor === "white") {
    return "b(white)";
  }
  return "b(black)";
};

const Breadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({
  links,
  fontColor = "black",
}) => {
  // taking in the array of objects as defined above, create an array of Link components or a <span> if there is no href
  const arrayLinks = links.map((link, index) =>
    link.href ? (
      <Link
        href={link.href}
        title={link.title}
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        data-h2-font-color={fontColorExtract(fontColor)}
      >
        {link.title}
      </Link>
    ) : (
      <span
        data-h2-font-weight="b(700)"
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        data-h2-font-color={fontColorExtract(fontColor)}
      >
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
