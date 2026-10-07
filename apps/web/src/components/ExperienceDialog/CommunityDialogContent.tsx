import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Separator } from "@gc-digital-talent/ui";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "../ExperienceCard/ContentSection";
import type { ContentProps } from "../ExperienceCard/types";
import DatesSection from "./DatesSection";

export interface CommunityDialogContentExperience {
  __typename?: "CommunityExperience";
  title?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  organization?: string | null;
  project?: string | null;
  details?: string | null;
}

const CommunityDialogContent = ({
  experience,
  headingRank,
}: ContentProps<CommunityDialogContentExperience>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl, "community");
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);
  const { title, organization, project, details } = experience;

  return (
    <>
      <div className="flex flex-col gap-y-6">
        <ContentSection
          headingRank={headingRank}
          title={intl.formatMessage({
            defaultMessage: "Role or title",
            id: "eOIwNx",
            description:
              "Label displayed on Community Experience form for role input",
          })}
        >
          {title ?? notAvailable}
        </ContentSection>
        <DatesSection experience={experience} headingRank={headingRank} />
      </div>
      <Separator space="sm" decorative />
      <div className="flex flex-col gap-y-6">
        <ContentSection
          headingRank={headingRank}
          title={experienceFormLabels.organization}
        >
          {organization ?? notAvailable}
        </ContentSection>
        <ContentSection
          headingRank={headingRank}
          title={experienceFormLabels.project}
        >
          {project ?? notAvailable}
        </ContentSection>
        <ContentSection
          headingRank={headingRank}
          title={experienceFormLabels.keyTasksAndResponsibilities}
        >
          {details ?? notAvailable}
        </ContentSection>
      </div>
    </>
  );
};

export default CommunityDialogContent;
