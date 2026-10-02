import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Separator } from "@gc-digital-talent/ui";

import ContentSection from "../ExperienceCard/ContentSection";

interface DetailsSectionProps {
  title: string;
  details?: string | null;
}

const DetailsSection = ({ title, details }: DetailsSectionProps) => {
  const intl = useIntl();

  return (
    <>
      <Separator space="sm" decorative />
      <ContentSection title={title} headingRank="h3">
        {details ?? intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
    </>
  );
};

export default DetailsSection;
