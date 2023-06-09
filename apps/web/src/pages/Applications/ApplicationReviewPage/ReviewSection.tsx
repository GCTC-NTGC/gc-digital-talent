import React from "react";
import { Heading, Link } from "@gc-digital-talent/ui";
import { useIntl } from "react-intl";

interface ReviewSectionProps {
  title: string;
  path: string;
  editLinkAriaLabel: string;
  children: React.ReactNode;
}

const ReviewSection = ({
  title,
  path,
  editLinkAriaLabel,
  children,
}: ReviewSectionProps) => {
  const intl = useIntl();
  return (
    <section data-h2-margin-bottom="base(x3)">
      <div
        data-h2-display="base(flex)"
        data-h2-justify-content="base(space-between)"
        data-h2-align-items="base(center)"
      >
        <Heading level="h3" data-h2-margin-top="base(0)">
          {title}
        </Heading>
        <Link mode="inline" href={path} aria-label={editLinkAriaLabel}>
          {intl.formatMessage({
            defaultMessage: "Edit this section",
            id: "Z8hEuY",
            description: "Default edit link text for application review page",
          })}
        </Link>
      </div>
      {children}
    </section>
  );
};

export default ReviewSection;
