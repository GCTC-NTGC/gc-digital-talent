import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { empty } from "@gc-digital-talent/helpers";

export const EmployeeProfileCareerDevelopmentAllEmptyValidation_Fragment =
  graphql(/* GraphQL */ `
    fragment EmployeeProfileCareerDevelopmentAllEmptyValidation on EmployeeProfile {
      lateralMoveInterest
      lateralMoveTimeFrame {
        value
      }
      lateralMoveOrganizationType {
        value
      }
      promotionMoveInterest
      promotionMoveTimeFrame {
        value
      }
      promotionMoveOrganizationType {
        value
      }
      eligibleRetirementYearKnown
      eligibleRetirementYear
      mentorshipStatus {
        value
      }
      mentorshipInterest {
        value
      }
      execInterest
      execCoachingStatus {
        value
      }
      execCoachingInterest {
        value
      }
    }
  `);

export function hasAllEmptyFields(
  q: FragmentType<
    typeof EmployeeProfileCareerDevelopmentAllEmptyValidation_Fragment
  >,
): boolean {
  // should learningOpportunitiesInterest be in here?
  const d = getFragment(
    EmployeeProfileCareerDevelopmentAllEmptyValidation_Fragment,
    q,
  );
  return (
    empty(d.lateralMoveInterest) &&
    !d.lateralMoveTimeFrame &&
    !d.lateralMoveOrganizationType &&
    empty(d.promotionMoveInterest) &&
    !d.promotionMoveTimeFrame &&
    !d.promotionMoveOrganizationType &&
    empty(d.eligibleRetirementYearKnown) &&
    !d.eligibleRetirementYear &&
    !d.mentorshipStatus &&
    !d.mentorshipInterest &&
    empty(d.execInterest) &&
    !d.execCoachingStatus &&
    !d.execCoachingInterest
  );
}

export const EmployeeProfileCareerDevelopmentHasEmptyRequiredValidation_Fragment =
  graphql(/* GraphQL */ `
    fragment EmployeeProfileCareerDevelopmentHasEmptyRequiredValidation on EmployeeProfile {
      lateralMoveInterest
      promotionMoveInterest
      eligibleRetirementYearKnown
      eligibleRetirementYear
      mentorshipStatus {
        value
      }
      execInterest
      execCoachingStatus {
        value
      }
    }
  `);

export function hasEmptyRequiredFields(
  q: FragmentType<
    typeof EmployeeProfileCareerDevelopmentHasEmptyRequiredValidation_Fragment
  >,
): boolean {
  const d = getFragment(
    EmployeeProfileCareerDevelopmentHasEmptyRequiredValidation_Fragment,
    q,
  );
  return (
    empty(d.lateralMoveInterest) ||
    empty(d.promotionMoveInterest) ||
    empty(d.eligibleRetirementYearKnown) ||
    (d.eligibleRetirementYearKnown && !d.eligibleRetirementYear) ||
    !d.mentorshipStatus ||
    empty(d.execInterest) ||
    !d.execCoachingStatus
  );
}
