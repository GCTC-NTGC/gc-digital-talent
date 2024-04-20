import React from "react";

import { Heading, Link, HeadingRank, LinkProps } from "@gc-digital-talent/ui";

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
  <div
    className="rounded p-6 shadow-lg"
    data-h2-background-color="base(foreground)"
    data-h2-color="base(black)"
    {...rest}
  >
    <div className="items-center justify-between gap-20 sm:flex">
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
  </div>
);

export default CallToActionCard;
