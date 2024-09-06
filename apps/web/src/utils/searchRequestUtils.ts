import { EmploymentDuration } from "@gc-digital-talent/i18n";
import { Maybe, PositionDuration } from "@gc-digital-talent/graphql";

// eslint-disable-next-line import/prefer-default-export
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
