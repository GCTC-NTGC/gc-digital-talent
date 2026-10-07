import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Separator } from "@gc-digital-talent/ui";

import {
  formatDurationMonths,
  experienceDurationMonths,
  getExperienceDate,
  getExperienceFormLabels,
} from "~/utils/experienceUtils";
import experienceMessages from "~/messages/experienceMessages";

import ContentSection from "../ExperienceCard/ContentSection";
import type { ContentProps } from "../ExperienceCard/types";

export interface PersonalDialogContentExperience {
  __typename?: "PersonalExperience";
  title?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  organization?: string | null;
  learningDescription?: string | null;
}

const PersonalDialogContent = ({
  experience,
  headingRank,
}: ContentProps<PersonalDialogContentExperience>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);
  const { title, startDate, organization, learningDescription } = experience;

  return (
    <>
      <div className="flex flex-col gap-y-6">
        <ContentSection
          headingRank={headingRank}
          title={experienceFormLabels.projectOrRole}
        >
          {title ?? notAvailable}
        </ContentSection>
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
            {startDate
              ? formatDurationMonths(experienceDurationMonths(experience), intl)
              : notAvailable}
          </ContentSection>
        </div>
      </div>
      <Separator space="sm" decorative />
      <div className="flex flex-col gap-y-6">
        <ContentSection
          headingRank={headingRank}
          title={experienceFormLabels.organizationOrPlatform}
        >
          {organization ?? notAvailable}
        </ContentSection>
        <ContentSection
          headingRank={headingRank}
          title={experienceFormLabels.learningDescription}
        >
          {learningDescription ?? notAvailable}
        </ContentSection>
      </div>
    </>
  );
};

export default PersonalDialogContent;
