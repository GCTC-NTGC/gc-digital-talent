import { useIntl } from "react-intl";

import type { GenericLocalizedEnum } from "@gc-digital-talent/i18n";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import type { CafEmploymentType, CafRank } from "@gc-digital-talent/graphql";
import { Separator } from "@gc-digital-talent/ui";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "../ContentSection";
import type { ContentProps } from "../types";

export interface CafContentExperience {
  cafEmploymentType?: GenericLocalizedEnum<CafEmploymentType> | null;
  cafRank?: GenericLocalizedEnum<CafRank> | null;
}

const CafContent = ({
  experience: { cafEmploymentType, cafRank },
  headingLevel,
}: ContentProps<CafContentExperience>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  return (
    <>
      <ContentSection
        title={experienceFormLabels.cafEmploymentType}
        headingLevel={headingLevel}
        className="sm:border-r sm:border-gray-200 dark:border-gray-500"
      >
        {getLocalizedName(cafEmploymentType?.label, intl)}
      </ContentSection>
      <Separator space="sm" decorative />
      <ContentSection
        title={experienceFormLabels.cafRank}
        headingLevel={headingLevel}
        className="sm:border-r sm:border-gray-200 dark:border-gray-500"
      >
        {getLocalizedName(cafRank?.label, intl)}
      </ContentSection>
    </>
  );
};

export default CafContent;
