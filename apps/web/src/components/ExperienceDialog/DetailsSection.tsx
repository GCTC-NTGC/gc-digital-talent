import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import type { HeadingRank } from "@gc-digital-talent/ui";
import { Separator } from "@gc-digital-talent/ui";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "../ExperienceCard/ContentSection";

interface DetailsSectionProps {
  details?: string | null;
  headingRank?: HeadingRank;
}

const DetailsSection = ({
  details,
  headingRank = "h3",
}: DetailsSectionProps) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  return (
    <>
      <Separator space="sm" decorative />
      <ContentSection
        title={experienceFormLabels.details}
        headingRank={headingRank}
      >
        {details ?? intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
    </>
  );
};

export default DetailsSection;
