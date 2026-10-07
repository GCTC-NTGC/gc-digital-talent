import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import type { HeadingRank } from "@gc-digital-talent/ui";

import type { ExperienceForDate } from "~/types/experience";
import {
  experienceDurationMonths,
  formatDurationMonths,
  getExperienceDate,
} from "~/utils/experienceUtils";
import experienceMessages from "~/messages/experienceMessages";

import ContentSection from "../ExperienceCard/ContentSection";

interface DatesSectionProps {
  experience: ExperienceForDate;
  headingRank?: HeadingRank;
}

const DatesSection = ({ experience, headingRank }: DatesSectionProps) => {
  const intl = useIntl();
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <ContentSection
        headingRank={headingRank}
        title={intl.formatMessage(experienceMessages.dates)}
      >
        {getExperienceDate(experience, intl) ?? notAvailable}
      </ContentSection>
      <ContentSection
        headingRank={headingRank}
        title={intl.formatMessage(experienceMessages.duration)}
      >
        {experience.startDate
          ? formatDurationMonths(experienceDurationMonths(experience), intl)
          : notAvailable}
      </ContentSection>
    </div>
  );
};

export default DatesSection;
