import React from "react";
import { Heading, Link } from "@gc-digital-talent/ui";
import { useIntl } from "react-intl";

interface ReviewSectionProps {
  title: string;
  path: string;
  children: React.ReactNode;
}

const ReviewSection = ({
  title,
  path,
  children,
  ...rest
}: ReviewSectionProps) => {
  const intl = useIntl();
  return (
    <section data-h2-margin-bottom="base(x3)">
      <div
        data-h2-display="base(flex)"
        data-h2-justify-content="base(space-between)"
        data-h2-align-items="base(center)"
        {...rest}
      >
        <Heading level="h4" data-h2-margin-top="base(0)">
          {title}
        </Heading>
        <Link type="button" mode="inline" color="secondary" href={path}>
          {intl.formatMessage({
            defaultMessage: "Edit this section",
            id: "mu6uvE",
          })}
        </Link>
      </div>
      {children}
    </section>
  );
};

export default ReviewSection;
