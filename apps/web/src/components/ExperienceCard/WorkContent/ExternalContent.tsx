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
        data-h2-border-right="l-tablet(1px solid gray.lighter)"
      >
        {division ?? intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
      <Separator space="sm" decorative />
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-grid-template-columns="l-tablet(repeat(2, 1fr))"
      >
        <ContentSection
          title={experienceFormLabels.extSizeOfOrganization}
          headingLevel={headingLevel}
          data-h2-border-right="l-tablet(1px solid gray.lighter)"
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
