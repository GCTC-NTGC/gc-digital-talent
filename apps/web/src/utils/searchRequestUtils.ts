import { IntlShape } from "react-intl";

import { EmploymentDuration } from "@gc-digital-talent/i18n";
import {
  EquitySelections,
  Maybe,
  PositionDuration,
} from "@gc-digital-talent/graphql";

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
): string =>
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

export const equitySelectionsToDescriptions = (
  equity: Maybe<EquitySelections> | undefined,
  intl: IntlShape,
): string[] => [
  ...(equity?.isWoman
    ? [
        intl.formatMessage({
          defaultMessage: "Woman",
          id: "/fglL0",
          description:
            "Message for woman option in the employment equity section of the request page.",
        }),
      ]
    : []),
  ...(equity?.isVisibleMinority
    ? [
        intl.formatMessage({
          defaultMessage: "Visible Minority",
          id: "4RK/oW",
          description:
            "Message for visible minority option in the employment equity section of the request page.",
        }),
      ]
    : []),
  ...(equity?.isIndigenous
    ? [
        intl.formatMessage({
          defaultMessage: "Indigenous",
          id: "YoIRbn",
          description: "Title for Indigenous",
        }),
      ]
    : []),
  ...(equity?.hasDisability
    ? [
        intl.formatMessage({
          defaultMessage: "Disability",
          id: "GHlK/f",
          description:
            "Message for disability option in the employment equity section of the request page.",
        }),
      ]
    : []),
];
