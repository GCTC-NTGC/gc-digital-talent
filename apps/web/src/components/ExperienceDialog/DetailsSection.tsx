import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import type { HeadingRank } from "@gc-digital-talent/ui";
import { Separator } from "@gc-digital-talent/ui";

import ContentSection from "../ExperienceCard/ContentSection";

interface DetailsSectionProps {
  title: string;
  details?: string | null;
  headingRank?: HeadingRank;
}

const DetailsSection = ({
  title,
  details,
  headingRank = "h3",
}: DetailsSectionProps) => {
  const intl = useIntl();

  return (
    <>
      <Separator space="sm" decorative />
      <ContentSection title={title} headingRank={headingRank}>
        {details ?? intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
    </>
  );
};

export default DetailsSection;
