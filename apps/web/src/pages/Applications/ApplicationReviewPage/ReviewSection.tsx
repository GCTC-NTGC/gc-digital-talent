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
    <div className="mt-20">
      <div className="flex items-center justify-between">
        <Heading level="h3" size="h4" className="mt-0 font-bold">
          {title}
        </Heading>
        <Link mode="inline" href={path} aria-label={editLinkAriaLabel}>
          {intl.formatMessage(commonMessages.editThisSection)}
        </Link>
      </div>
      {children}
    </div>
  );
};

export default ReviewSection;
