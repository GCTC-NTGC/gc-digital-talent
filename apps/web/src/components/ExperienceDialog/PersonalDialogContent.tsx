import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Separator } from "@gc-digital-talent/ui";

import { getExperienceFormLabels } from "~/utils/experienceUtils";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";

import ContentSection from "../ExperienceCard/ContentSection";
import type { ContentProps } from "../ExperienceCard/types";
import DatesSection from "./DatesSection";

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
  const { title, organization, learningDescription } = experience;

  return (
    <>
      <div className="flex flex-col gap-y-6">
        <ContentSection
          headingRank={headingRank}
          title={experienceFormLabels.projectOrRole}
        >
          {title ?? notAvailable}
        </ContentSection>
        <DatesSection experience={experience} headingRank={headingRank} />
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
        <ContentSection
          headingRank={headingRank}
          title={experienceFormLabels.disclaimer}
        >
          <BoolCheckIcon value={true}>
            {intl.formatMessage({
              defaultMessage:
                "I agree to share this information with verified Government of Canada hiring managers and HR advisors who have access to this platform.",
              id: "oURESC",
              description:
                "Label displayed on Personal Experience form for disclaimer checkbox",
            })}
          </BoolCheckIcon>
        </ContentSection>
      </div>
    </>
  );
};

export default PersonalDialogContent;
