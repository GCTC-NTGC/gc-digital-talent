import React from "react";
import { ChevronRightIcon } from "@heroicons/react/solid";
import { uniqueId } from "lodash";
import Link from "../Link";
import { insertBetween } from "../../helpers/util";

export interface BreadcrumbsProps {
  links: { title: string; href?: string; icon?: JSX.Element }[];
}

export const Breadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({
  links,
}) => {
  // taking in the array of objects as defined above, create an array of Link components or a <span> if there is no href
  const arrayLinks = links.map((link) =>
    link.href ? (
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

  /**
   * HACK:  This is not ideal, however since we are injecting separators
   *        We need to use array index if a key does not exist on item.
   *
   *        Since this list does not re-render and should always be
   *        replaced on page navigation it shouldn't be too large an issue.
   *
   *        Suggestions very welcome.
   */
  return (
    <div data-h2-display="b(flex)">
      {menuBar.map((el, index) =>
        React.cloneElement(el, { key: el.key || `sep-${index}` }),
      )}
    </div>
  );
};

export default Breadcrumbs;
