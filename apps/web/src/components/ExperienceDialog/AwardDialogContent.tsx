import { useIntl } from "react-intl";

import type { GenericLocalizedEnum } from "@gc-digital-talent/i18n";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { AwardedTo } from "@gc-digital-talent/graphql";
import type { AwardedScope } from "@gc-digital-talent/graphql";
import { Separator } from "@gc-digital-talent/ui";

import type { ExperienceForInfo } from "~/utils/experienceUtils";
import {
  getExperienceFormLabels,
  useExperienceInfo,
} from "~/utils/experienceUtils";
import { formattedDate } from "~/utils/dateUtils";

import ContentSection from "../ExperienceCard/ContentSection";
import type { ContentProps } from "../ExperienceCard/types";

export interface AwardDialogContentExperience {
  title?: string | null;
  awardedDate?: string | null;
  issuedBy?: string | null;
  awardedTo?: GenericLocalizedEnum<AwardedTo> | null;
  awardedScope?: GenericLocalizedEnum<AwardedScope> | null;
  projectName?: string | null;
  relatedExperience?: ExperienceForInfo | null;
}

interface RelatedExperienceProps {
  experience: ExperienceForInfo;
}

const RelatedExperience = ({ experience }: RelatedExperienceProps) => {
  const { title, icon: Icon } = useExperienceInfo(experience);

  return (
    <span className="flex items-center gap-x-1.5">
      <Icon className="size-4.5 shrink-0 text-secondary" aria-hidden="true" />
      <span>{title}</span>
    </span>
  );
};

const AwardDialogContent = ({
  experience: {
    title,
    awardedDate,
    issuedBy,
    awardedTo,
    awardedScope,
    projectName,
    relatedExperience,
  },
  headingRank,
}: ContentProps<AwardDialogContentExperience>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  return (
    <>
      <div className="flex flex-col gap-y-6">
        <ContentSection
          headingRank={headingRank}
          title={experienceFormLabels.awardTitle}
        >
          {title ?? notAvailable}
        </ContentSection>
        <ContentSection
          headingRank={headingRank}
          title={experienceFormLabels.awardedDate}
        >
          {awardedDate ? formattedDate(awardedDate, intl) : notAvailable}
        </ContentSection>
      </div>
      <Separator space="sm" decorative />
      <div className="flex flex-col gap-y-6">
        <ContentSection
          headingRank={headingRank}
          title={experienceFormLabels.issuedBy}
        >
          {issuedBy ?? notAvailable}
        </ContentSection>
        <ContentSection
          headingRank={headingRank}
          title={experienceFormLabels.relatedExperience}
        >
          {relatedExperience ? (
            <RelatedExperience experience={relatedExperience} />
          ) : (
            notAvailable
          )}
        </ContentSection>
        <div className="grid gap-6 sm:grid-cols-2">
          <ContentSection
            headingRank={headingRank}
            title={experienceFormLabels.awardedTo}
          >
            {awardedTo?.label
              ? getLocalizedName(awardedTo.label, intl)
              : notAvailable}
          </ContentSection>
          <ContentSection
            headingRank={headingRank}
            title={experienceFormLabels.awardedScope}
          >
            {awardedScope?.label
              ? getLocalizedName(awardedScope.label, intl)
              : notAvailable}
          </ContentSection>
        </div>
        {awardedTo?.value === AwardedTo.MyProject && (
          <ContentSection
            headingRank={headingRank}
            title={experienceFormLabels.projectName}
          >
            {projectName ?? notAvailable}
          </ContentSection>
        )}
      </div>
    </>
  );
};

export default AwardDialogContent;
