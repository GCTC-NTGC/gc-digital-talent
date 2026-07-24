import type { IntlShape } from "react-intl";
import { differenceInCalendarDays } from "date-fns/differenceInCalendarDays";

import { EmploymentDuration } from "@gc-digital-talent/i18n";
import type { ChipProps } from "@gc-digital-talent/ui";
import type { EquitySelections } from "@gc-digital-talent/graphql";
import {
  PositionDuration,
  TalentRequestPositionType,
  TalentRequestStatus,
} from "@gc-digital-talent/graphql";

import talentRequestMessages from "~/messages/talentRequestMessages";

export const TALENT_REQUEST_STATUS_COLOUR_MAP: Record<
  TalentRequestStatus,
  ChipProps["color"]
> = {
  [TalentRequestStatus.New]: "warning",
  [TalentRequestStatus.InProgress]: "primary",
  [TalentRequestStatus.Completed]: "gray",
} as const;

export const positionDurationToEmploymentDuration = (
  durations?: (PositionDuration | null | undefined)[] | null,
): string => {
  if (durations?.includes(PositionDuration.Temporary)) {
    return EmploymentDuration.Term;
  }
  // Search/Request currently selects TEMPORARY or PERMANENT or NULL, no combinations
  // therefore if applicant.positionDuration exists, durations exists as an array of either TEMPORARY or PERMANENT
  return EmploymentDuration.Indeterminate;
};

export const hasDiplomaToEducationLevel = (
  hasDiploma: boolean | null | undefined,
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
  equity: EquitySelections | null | undefined,
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

export const positionTypeToYesNoSupervisoryStatement = (
  positionType: TalentRequestPositionType | null | undefined,
  intl: IntlShape,
): string | null => {
  if (positionType === TalentRequestPositionType.TeamLead) {
    return intl.formatMessage(talentRequestMessages.supervisoryPositionYes);
  }
  if (positionType === TalentRequestPositionType.IndividualContributor) {
    return intl.formatMessage(talentRequestMessages.supervisoryPositionNo);
  }
  return null;
};

export const followUpDateOverdueInfo = (
  followUpDate?: Date | null,
  compareTo?: Date,
) => {
  const now = compareTo ?? new Date();
  const daysOverdue = followUpDate
    ? differenceInCalendarDays(now, followUpDate)
    : -1;
  const isOverdue = daysOverdue > 0;
  const isDueToday = daysOverdue === 0;

  return { daysOverdue, isOverdue, isDueToday };
};
