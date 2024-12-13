import { useIntl } from "react-intl";

import { getLocalizedName } from "@gc-digital-talent/i18n";
import { WorkExperience } from "@gc-digital-talent/graphql";
import { Separator } from "@gc-digital-talent/ui";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "../ContentSection";
import { ContentProps } from "../types";

const CafContent = ({
  experience: { cafEmploymentType, cafRank },
  headingLevel,
}: ContentProps<Omit<WorkExperience, "user">>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  return (
    <>
      <ContentSection
        title={experienceFormLabels.cafEmploymentType}
        headingLevel={headingLevel}
        data-h2-border-right="l-tablet(1px solid gray.lighter)"
      >
        {getLocalizedName(cafEmploymentType?.label, intl)}
      </ContentSection>
      <Separator space="sm" decorative />
      <ContentSection
        title={experienceFormLabels.cafRank}
        headingLevel={headingLevel}
        data-h2-border-right="l-tablet(1px solid gray.lighter)"
      >
        {getLocalizedName(cafRank?.label, intl)}
      </ContentSection>
    </>
  );
};

export default CafContent;
