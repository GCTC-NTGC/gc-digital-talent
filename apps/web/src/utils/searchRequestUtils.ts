import { IntlShape } from "react-intl";

import { EmploymentDuration } from "@gc-digital-talent/i18n";
import { Maybe, PositionDuration } from "@gc-digital-talent/graphql";

export const positionDurationToEmploymentDuration = (
  durations: Maybe<PositionDuration>[],
): string => {
  if (durations?.includes(PositionDuration.Temporary)) {
    return EmploymentDuration.Term;
  }
  // Search/Request currently selects TEMPORARY or PERMANENT or NULL, no combinations
  // therefore if applicant.positionDuration exists, durations exists as an array of either TEMPORARY or PERMANENT
  return EmploymentDuration.Indeterminate;
};

export const hasDiplomaToEducationLevel = (
  hasDiploma: Maybe<boolean> | undefined,
  intl: IntlShape,
): string | undefined =>
  hasDiploma
    ? intl.formatMessage({
        defaultMessage: "Required diploma from post-secondary institution",
        id: "/mFrpj",
        description:
          "Education level message when candidate has a diploma found on the request page.",
      })
    : intl.formatMessage({
        defaultMessage:
          "Can accept a combination of work experience and education",
        id: "9DCx2n",
        description:
          "Education level message when candidate does not have a diploma found on the request page.",
      });
