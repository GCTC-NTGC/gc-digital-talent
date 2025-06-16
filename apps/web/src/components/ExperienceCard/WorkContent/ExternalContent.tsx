import { useIntl } from "react-intl";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { WorkExperience } from "@gc-digital-talent/graphql";
import { Separator } from "@gc-digital-talent/ui";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "../ContentSection";
import { ContentProps } from "../types";

const ExternalContent = ({
  experience: { division, extSizeOfOrganization, extRoleSeniority },
  headingLevel,
}: ContentProps<Omit<WorkExperience, "user">>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  return (
    <>
      <ContentSection
        title={experienceFormLabels.team}
        headingLevel={headingLevel}
        className="sm:border-r sm:border-gray-200 dark:border-gray-500"
      >
        {division ?? intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
      <Separator space="sm" decorative />
      <div className="grid gap-6 sm:grid-cols-2">
        <ContentSection
          title={experienceFormLabels.extSizeOfOrganization}
          headingLevel={headingLevel}
          className="sm:border-r sm:border-gray-200 dark:border-gray-500"
        >
          {getLocalizedName(extSizeOfOrganization?.label, intl)}
        </ContentSection>
        <ContentSection
          title={experienceFormLabels.extRoleSeniority}
          headingLevel={headingLevel}
        >
          {getLocalizedName(extRoleSeniority?.label, intl)}
        </ContentSection>
      </div>
    </>
  );
};

export default ExternalContent;
