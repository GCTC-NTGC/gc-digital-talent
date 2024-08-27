import { ReactNode } from "react";

import { Link, LinkProps, Heading, Well } from "@gc-digital-talent/ui";

type WellLink = Omit<LinkProps, "children"> & {
  label: ReactNode;
};

interface LinkWellProps {
  title: ReactNode;
  links: WellLink[];
}

const LinkWell = ({ title, links }: LinkWellProps) => (
  <Well>
    <Heading level="h3" size="h5" data-h2-margin="base(0, 0, x.5, 0)">
      {title}
    </Heading>
    <div
      data-h2-display="base(flex)"
      data-h2-flex-wrap="base(wrap)"
      data-h2-gap="base(x.5)"
    >
      {links.map(({ label, ...rest }) => (
        <Link key={rest.href} color="secondary" mode="solid" {...rest}>
          {label}
        </Link>
      ))}
    </div>
  </Well>
);

export default LinkWell;
