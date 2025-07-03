import { useIntl } from "react-intl";

import { empty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  getExecCoachingInterest,
  getMentorshipInterest,
  getLearningOpportunitiesInterest,
} from "@gc-digital-talent/i18n";
import { Card, CardSeparator, Ul } from "@gc-digital-talent/ui";
import {
  ExecCoaching,
  FragmentType,
  getFragment,
  graphql,
  Mentorship,
  OrganizationTypeInterest,
} from "@gc-digital-talent/graphql";
import {
  formatDate,
  formDateStringToDate,
} from "@gc-digital-talent/date-helpers";

import messages from "~/messages/careerDevelopmentMessages";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";
import {
  displayExecCoachingStatus,
  displayMentorshipStatus,
} from "~/components/CareerDevelopmentPreferences/utils";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

export const CareerDevelopment_Fragment = graphql(/* GraphQL */ `
  fragment CareerDevelopment on EmployeeProfile {
    lateralMoveInterest
    lateralMoveTimeFrame {
      label {
        localized
      }
    }
    lateralMoveOrganizationType {
      value
      label {
        localized
      }
    }
    promotionMoveInterest
    promotionMoveTimeFrame {
      value
      label {
        localized
      }
    }
    promotionMoveOrganizationType {
      value
      label {
        localized
      }
    }
    learningOpportunitiesInterest {
      value
      label {
        localized
      }
    }
    eligibleRetirementYearKnown
    eligibleRetirementYear
    mentorshipStatus {
      value
      label {
        localized
      }
    }
    mentorshipInterest {
      value
      label {
        localized
      }
    }
    execInterest
    execCoachingStatus {
      value
      label {
        localized
      }
    }
    execCoachingInterest {
      value
      label {
        localized
      }
    }
  }
`);

export const CareerDevelopmentOptions_Fragment = graphql(/* GraphQL */ `
  fragment CareerDevelopmentOptions on Query {
    organizationTypeInterest: localizedEnumStrings(
      enumName: "OrganizationTypeInterest"
    ) {
      value
      label {
        localized
      }
    }
    mentorship: localizedEnumStrings(enumName: "Mentorship") {
      value
      label {
        localized
      }
    }
    execCoaching: localizedEnumStrings(enumName: "ExecCoaching") {
      value
      label {
        localized
      }
    }
    learningOpportunitiesInterest: localizedEnumStrings(
      enumName: "LearningOpportunitiesInterest"
    ) {
      value
      label {
        localized
      }
    }
  }
`);

interface CareerDevelopmentSectionProps {
  employeeProfileQuery: FragmentType<typeof CareerDevelopment_Fragment>;
  careerDevelopmentOptionsQuery: FragmentType<
    typeof CareerDevelopmentOptions_Fragment
  >;
}

const CareerDevelopmentSection = ({
  employeeProfileQuery,
  careerDevelopmentOptionsQuery,
}: CareerDevelopmentSectionProps) => {
  const intl = useIntl();
  const careerDevelopmentMessages = messages(intl);

  const employeeProfile = getFragment(
    CareerDevelopment_Fragment,
    employeeProfileQuery,
  );

  const careerDevelopmentOptions = getFragment(
    CareerDevelopmentOptions_Fragment,
    careerDevelopmentOptionsQuery,
  );

  const lateralMoveOrganizationTypes = unpackMaybes(
    employeeProfile.lateralMoveOrganizationType,
  ).map((interest) => interest.value);

  const promotionMoveOrganizationTypes = unpackMaybes(
    employeeProfile.promotionMoveOrganizationType,
  ).map((interest) => interest.value);

  const mentorshipInterests = unpackMaybes(
    employeeProfile.mentorshipInterest,
  ).map((interest) => interest.value);

  const execCoachingInterests = unpackMaybes(
    employeeProfile.execCoachingInterest,
  ).map((interest) => interest.value);

  const lateralMoveInterestMessage = employeeProfile.lateralMoveInterest
    ? intl.formatMessage({
        defaultMessage:
          "I'm interested in receiving opportunities for jobs at, or equivalent to, my current group and level.",
        id: "4pwxOm",
        description: "The lateral move interest described as interested.",
      })
    : intl.formatMessage({
        defaultMessage: "I'm not looking for lateral movement right now.",
        id: "gOy6PW",
        description: "The lateral move interest described as not interested.",
      });

  const promotionMoveInterestMessage = employeeProfile.promotionMoveInterest
    ? intl.formatMessage({
        defaultMessage:
          "I’m interested in receiving opportunities for promotion and advancement.",
        id: "2tAqF/",
        description: "The promotion move interest described as interested.",
      })
    : intl.formatMessage({
        defaultMessage:
          "I’m not looking for a promotion or advancement right now.",
        id: "tXLRmG",
        description: "The promotion move interest described as not interested.",
      });

  const eligibleRetirementYearKnownMessage =
    employeeProfile.eligibleRetirementYearKnown
      ? intl.formatMessage({
          defaultMessage: "I know the year in which I'm eligible to retire.",
          id: "f0dhMc",
          description: "The eligible retirement year described as known.",
        })
      : intl.formatMessage({
          defaultMessage: "I'm not sure about the year I'm eligible to retire.",
          id: "a5YBuH",
          description: "The eligible retirement year described as unknown.",
        });

  const execInterestMessage = employeeProfile.execInterest
    ? intl.formatMessage({
        defaultMessage:
          "I'd like to be considered for executive-level opportunities.",
        id: "WoZ3pB",
        description: "The executive interest described as interested.",
      })
    : intl.formatMessage({
        defaultMessage: "I'm not interested in executive-level opportunities.",
        id: "vFV5N8",
        description: "The executive interest described as not interested.",
      });

  const learningOpportunitiesInterestOptions = unpackMaybes(
    employeeProfile.learningOpportunitiesInterest,
  ).map((interest) => String(interest.value));

  return (
    <Card className="flex flex-col gap-6">
      <FieldDisplay label={careerDevelopmentMessages.lateralMoveInterest}>
        {empty(employeeProfile.lateralMoveInterest)
          ? intl.formatMessage(commonMessages.notProvided)
          : lateralMoveInterestMessage}
      </FieldDisplay>
      <FieldDisplay label={careerDevelopmentMessages.lateralMoveTimeFrame}>
        {employeeProfile.lateralMoveTimeFrame
          ? employeeProfile.lateralMoveTimeFrame.label.localized
          : intl.formatMessage(commonMessages.notProvided)}
      </FieldDisplay>
      <FieldDisplay
        label={careerDevelopmentMessages.lateralMoveOrganizationType}
      >
        {employeeProfile.lateralMoveOrganizationType ? (
          <Ul unStyled space="md">
            {unpackMaybes(
              careerDevelopmentOptions.organizationTypeInterest,
            ).map((x) => {
              const iconValue = lateralMoveOrganizationTypes.includes(
                x.value as OrganizationTypeInterest,
              );
              return (
                <li key={x.value}>
                  <BoolCheckIcon
                    value={iconValue}
                    trueLabel={intl.formatMessage({
                      defaultMessage: "Interested in",
                      id: "AQiPuW",
                      description:
                        "Label for user expressing interest in a specific work stream",
                    })}
                    falseLabel={intl.formatMessage({
                      defaultMessage: "Not interested in",
                      id: "KyLikL",
                      description:
                        "Label for user expressing they are not interested in a specific work stream",
                    })}
                  >
                    {x.label.localized ??
                      intl.formatMessage(commonMessages.notFound)}
                  </BoolCheckIcon>
                </li>
              );
            })}
          </Ul>
        ) : (
          intl.formatMessage(commonMessages.notProvided)
        )}
      </FieldDisplay>
      <CardSeparator space="xs" />
      <FieldDisplay label={careerDevelopmentMessages.promotionMoveInterest}>
        {empty(employeeProfile.promotionMoveInterest)
          ? intl.formatMessage(commonMessages.notProvided)
          : promotionMoveInterestMessage}
      </FieldDisplay>
      <FieldDisplay label={careerDevelopmentMessages.promotionMoveTimeFrame}>
        {employeeProfile.promotionMoveTimeFrame
          ? employeeProfile.promotionMoveTimeFrame.label.localized
          : intl.formatMessage(commonMessages.notProvided)}
      </FieldDisplay>
      <FieldDisplay
        label={careerDevelopmentMessages.promotionMoveOrganizationType}
      >
        {employeeProfile.promotionMoveOrganizationType ? (
          <Ul unStyled space="md">
            {unpackMaybes(
              careerDevelopmentOptions?.organizationTypeInterest,
            ).map((x) => {
              const iconValue = promotionMoveOrganizationTypes.includes(
                x.value as OrganizationTypeInterest,
              );
              return (
                <li key={x.value}>
                  <BoolCheckIcon
                    value={iconValue}
                    trueLabel={intl.formatMessage({
                      defaultMessage: "Interested in",
                      id: "AQiPuW",
                      description:
                        "Label for user expressing interest in a specific work stream",
                    })}
                    falseLabel={intl.formatMessage({
                      defaultMessage: "Not interested in",
                      id: "KyLikL",
                      description:
                        "Label for user expressing they are not interested in a specific work stream",
                    })}
                  >
                    {x.label.localized ??
                      intl.formatMessage(commonMessages.notFound)}
                  </BoolCheckIcon>
                </li>
              );
            })}
          </Ul>
        ) : (
          intl.formatMessage(commonMessages.notProvided)
        )}
      </FieldDisplay>
      <CardSeparator space="xs" />
      <FieldDisplay
        label={careerDevelopmentMessages.learningOpportunitiesInterest}
      >
        {employeeProfile.learningOpportunitiesInterest ? (
          <Ul unStyled space="md">
            {unpackMaybes(
              careerDevelopmentOptions?.learningOpportunitiesInterest,
            ).map((x) => {
              const iconValue = Array.isArray(
                learningOpportunitiesInterestOptions,
              )
                ? learningOpportunitiesInterestOptions.includes(x.value)
                : false;
              return (
                <li key={x.value}>
                  <BoolCheckIcon
                    value={iconValue}
                    trueLabel={intl.formatMessage({
                      defaultMessage: "Interested in",
                      id: "AQiPuW",
                      description:
                        "Label for user expressing interest in a specific work stream",
                    })}
                    falseLabel={intl.formatMessage({
                      defaultMessage: "Not interested in",
                      id: "KyLikL",
                      description:
                        "Label for user expressing they are not interested in a specific work stream",
                    })}
                  >
                    {intl.formatMessage(
                      getLearningOpportunitiesInterest(x.value, iconValue),
                    )}
                  </BoolCheckIcon>
                </li>
              );
            })}
          </Ul>
        ) : (
          intl.formatMessage(commonMessages.notProvided)
        )}
      </FieldDisplay>
      <CardSeparator space="xs" />
      <FieldDisplay
        label={careerDevelopmentMessages.eligibleRetirementYearKnown}
      >
        {empty(employeeProfile.eligibleRetirementYearKnown)
          ? intl.formatMessage(commonMessages.notProvided)
          : eligibleRetirementYearKnownMessage}
      </FieldDisplay>
      <FieldDisplay label={careerDevelopmentMessages.eligibleRetirementYear}>
        {employeeProfile.eligibleRetirementYear
          ? formatDate({
              date: formDateStringToDate(
                employeeProfile.eligibleRetirementYear,
              ),
              formatString: "yyyy",
              intl,
            })
          : intl.formatMessage(commonMessages.notProvided)}
      </FieldDisplay>
      <CardSeparator space="xs" />
      <FieldDisplay label={careerDevelopmentMessages.mentorshipStatus}>
        {employeeProfile.mentorshipStatus
          ? intl.formatMessage(
              displayMentorshipStatus(employeeProfile.mentorshipStatus),
            )
          : intl.formatMessage(commonMessages.notProvided)}
      </FieldDisplay>
      <FieldDisplay label={careerDevelopmentMessages.mentorshipInterest}>
        {employeeProfile.mentorshipInterest ? (
          <Ul unStyled space="md">
            {unpackMaybes(careerDevelopmentOptions?.mentorship).map((x) => {
              const iconValue = mentorshipInterests.includes(
                x.value as Mentorship,
              );
              return (
                <li key={x.value}>
                  <BoolCheckIcon value={iconValue}>
                    {intl.formatMessage(
                      getMentorshipInterest(x.value, iconValue),
                    )}
                  </BoolCheckIcon>
                </li>
              );
            })}
          </Ul>
        ) : (
          intl.formatMessage(commonMessages.notProvided)
        )}
      </FieldDisplay>
      <CardSeparator space="xs" />
      <FieldDisplay label={careerDevelopmentMessages.execInterest}>
        {empty(employeeProfile.execInterest)
          ? intl.formatMessage(commonMessages.notProvided)
          : execInterestMessage}
      </FieldDisplay>
      <FieldDisplay label={careerDevelopmentMessages.execCoachingStatus}>
        {intl.formatMessage(
          displayExecCoachingStatus(employeeProfile.execCoachingStatus),
        )}
      </FieldDisplay>
      <FieldDisplay label={careerDevelopmentMessages.execCoachingInterest}>
        {employeeProfile.execCoachingInterest ? (
          <Ul unStyled space="md">
            {unpackMaybes(careerDevelopmentOptions?.execCoaching).map((x) => {
              const iconValue = execCoachingInterests.includes(
                x.value as ExecCoaching,
              );
              return (
                <li key={x.value}>
                  <BoolCheckIcon value={iconValue}>
                    {intl.formatMessage(
                      getExecCoachingInterest(x.value, iconValue),
                    )}
                  </BoolCheckIcon>
                </li>
              );
            })}
          </Ul>
        ) : (
          intl.formatMessage(commonMessages.notProvided)
        )}
      </FieldDisplay>
    </Card>
  );
};

export default CareerDevelopmentSection;
