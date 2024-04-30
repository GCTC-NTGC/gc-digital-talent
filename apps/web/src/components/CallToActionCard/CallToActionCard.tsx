import React from "react";

import {
  Heading,
  Link,
  HeadingRank,
  LinkProps,
  CardBasic,
} from "@gc-digital-talent/ui";

interface CallToActionCardProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  heading: React.ReactNode;
  headingAs?: HeadingRank;
  link: {
    href: string;
    label: React.ReactNode;
    linkProps?: Omit<LinkProps, "children" | "href">;
  };
}

const CallToActionCard = ({
  heading,
  headingAs = "h3",
  children,
  link,
  ...rest
}: CallToActionCardProps) => (
  <CardBasic {...rest}>
    <div
      data-h2-display="p-tablet(flex)"
      data-h2-gap="base(x3)"
      data-h2-align-items="base(center)"
      data-h2-justify-content="base(space-between)"
    >
      <div>
        <Heading
          level={headingAs}
          size="h6"
          data-h2-margin="base(0, 0, x.5, 0)"
        >
          {heading}
        </Heading>
        {children}
      </div>
      <div
        data-h2-margin="base(x1, 0, 0, 0) p-tablet(0)"
        data-h2-flex-shrink="base(0)"
      >
        <Link
          color="secondary"
          mode="solid"
          href={link.href}
          style={{ whiteSpace: "nowrap" }}
          {...link?.linkProps}
        >
          {link.label}
        </Link>
      </div>
    </div>
  </CardBasic>
);

export default CallToActionCard;
