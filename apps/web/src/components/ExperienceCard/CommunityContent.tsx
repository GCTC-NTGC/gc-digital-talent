import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { CommunityExperience } from "@gc-digital-talent/graphql";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "./ContentSection";
import { ContentProps } from "./types";

const CommunityContent = ({
  experience: { project },
  headingLevel,
}: ContentProps<Omit<CommunityExperience, "user">>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  return (
    <ContentSection
      title={experienceFormLabels.project}
      headingLevel={headingLevel}
    >
      {project ?? intl.formatMessage(commonMessages.notAvailable)}
    </ContentSection>
  );
};

export default CommunityContent;
