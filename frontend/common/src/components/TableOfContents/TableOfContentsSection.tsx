import React, { HTMLAttributes } from "react";

import TableOfContentsHeading from "./TableOfContentsHeading";

export interface TableOfContentsSectionProps {
  id: string;
  title: string;
  icon?: React.FC<{ className: string }>;
}

const TableOfContentsSection: React.FC<
  TableOfContentsSectionProps & HTMLAttributes<HTMLDivElement>
> = ({ id, children, title, icon, ...rest }) => (
  <div data-toc-section data-toc-heading={title} id={id} {...rest}>
    <TableOfContentsHeading icon={icon}>{title}</TableOfContentsHeading>
    {children}
  </div>
);

export default TableOfContentsSection;
