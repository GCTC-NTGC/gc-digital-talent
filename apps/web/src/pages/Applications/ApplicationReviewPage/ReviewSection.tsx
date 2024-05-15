import { useIntl } from "react-intl";
import { ReactNode } from "react";

import { Heading, Link } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

interface ReviewSectionProps {
  title: string;
  path: string;
  editLinkAriaLabel: string;
  children: ReactNode;
}

const ReviewSection = ({
  title,
  path,
  editLinkAriaLabel,
  children,
}: ReviewSectionProps) => {
  const intl = useIntl();
  return (
    <section data-h2-margin="base(x3, 0, 0, 0)">
      <div
        data-h2-display="base(flex)"
        data-h2-justify-content="base(space-between)"
        data-h2-align-items="base(center)"
      >
        <Heading
          level="h3"
          size="h4"
          data-h2-font-weight="base(700)"
          data-h2-margin="base(0)"
        >
          {title}
        </Heading>
        <Link mode="inline" href={path} aria-label={editLinkAriaLabel}>
          {intl.formatMessage(commonMessages.editThisSection)}
        </Link>
      </div>
      {children}
    </section>
  );
};

export default ReviewSection;
