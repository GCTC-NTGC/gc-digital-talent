import { ReactNode } from "react";

import { Link, LinkProps, Heading, Well } from "@gc-digital-talent/ui";

type WellLink = Omit<LinkProps, "children"> & {
  label: ReactNode;
};

interface LinkWellProps {
  title: ReactNode;
  links: Array<WellLink>;
}

const LinkWell = ({ title, links }: LinkWellProps) => (
  <Well>
    <Heading level="h3" size="h5" className="mb-3 mt-0">
      {title}
    </Heading>
    <div className="flex flex-wrap gap-3">
      {links.map(({ label, ...rest }) => (
        <Link key={rest.href} color="secondary" mode="solid" {...rest}>
          {label}
        </Link>
      ))}
    </div>
  </Well>
);

export default LinkWell;
