import React from "react";

import { Heading, Link, HeadingRank, LinkProps } from "@gc-digital-talent/ui";

interface CallToActionCardProps {
  title: React.ReactNode;
  titleAs?: HeadingRank;
  children: React.ReactNode;
  link: {
    href: string;
    label: React.ReactNode;
    linkProps?: Omit<LinkProps, "children" | "href">;
  };
}

const CallToActionCard = ({
  title,
  titleAs = "h3",
  children,
  link,
}: CallToActionCardProps) => (
  <div
    data-h2-background-color="base(white) base:dark(black.light)"
    data-h2-color="base(black) base:dark(white)"
    data-h2-shadow="base(large)"
    data-h2-padding="base(x1)"
    data-h2-radius="base(rounded)"
  >
    <div
      data-h2-display="p-tablet(flex)"
      data-h2-gap="base(x3)"
      data-h2-align-items="base(center)"
    >
      <div>
        <Heading level={titleAs} size="h6" data-h2-margin="base(0, 0, x.5, 0)">
          {title}
        </Heading>
        {children}
      </div>
      <div data-h2-margin="base(x1, 0, 0, 0) p-tablet(0)">
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
  </div>
);

export default CallToActionCard;
