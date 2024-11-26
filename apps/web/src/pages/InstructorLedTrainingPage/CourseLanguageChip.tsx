import { useIntl } from "react-intl";

import { CourseLanguage } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Chip } from "@gc-digital-talent/ui";

const CourseLanguageChip = ({
  courseLanguage,
}: {
  courseLanguage?: CourseLanguage;
}) => {
  const intl = useIntl();
  switch (courseLanguage) {
    case CourseLanguage.Bilingual:
      return (
        <Chip color="tertiary">
          {intl.formatMessage(commonMessages.bilingual)}
        </Chip>
      );
    case CourseLanguage.English:
      return (
        <Chip color="primary">
          {intl.formatMessage(commonMessages.english)}
        </Chip>
      );
    case CourseLanguage.French:
      return (
        <Chip color="secondary">
          {intl.formatMessage(commonMessages.french)}
        </Chip>
      );
    default:
      return null;
  }
};

export default CourseLanguageChip;
