import { useIntl } from "react-intl";

import {
  commonMessages,
  getExecCoachingInterest,
  getMentorshipInterest,
  getLearningOpportunitiesInterest,
} from "@gc-digital-talent/i18n";
import { FragmentType, getFragment } from "@gc-digital-talent/graphql";
import { Well } from "@gc-digital-talent/ui";
import { empty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  formatDate,
  formDateStringToDate,
} from "@gc-digital-talent/date-helpers";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import { hasEmptyRequiredFields } from "~/validators/employeeProfile/careerDevelopment";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";
import messages from "~/messages/careerDevelopmentMessages";
import {
  displayExecCoachingStatus,
  displayMentorshipStatus,
} from "~/components/CareerDevelopmentPreferences/utils";

import {
  EmployeeProfileCareerDevelopment_Fragment,
  EmployeeProfileCareerDevelopmentOptions_Fragment,
} from "./utils";

interface DisplayProps {
  employeeProfileQuery: FragmentType<
    typeof EmployeeProfileCareerDevelopment_Fragment
  >;
  careerDevelopmentOptionsQuery: FragmentType<
    typeof EmployeeProfileCareerDevelopmentOptions_Fragment
  >;
}

const Display = ({
  employeeProfileQuery,
  careerDevelopmentOptionsQuery,
}: DisplayProps) => {
  const intl = useIntl();
  const careerDevelopmentMessages = messages(intl);
  const notProvided = intl.formatMessage(commonMessages.notProvided);

  const {
    lateralMoveInterest,
    lateralMoveTimeFrame,
    lateralMoveOrganizationType,
    promotionMoveInterest,
    promotionMoveTimeFrame,
    promotionMoveOrganizationType,
    learningOpportunitiesInterest,
    eligibleRetirementYearKnown,
    eligibleRetirementYear,
    mentorshipStatus,
    mentorshipInterest,
    execInterest,
    execCoachingStatus,
    execCoachingInterest,
  } = getFragment(
    EmployeeProfileCareerDevelopment_Fragment,
    employeeProfileQuery,
  );

  const careerDevelopmentOptions = getFragment(
    EmployeeProfileCareerDevelopmentOptions_Fragment,
    careerDevelopmentOptionsQuery,
  );

  const lateralMoveOrganizationTypes = unpackMaybes(
    lateralMoveOrganizationType,
  ).map((interest) => String(interest.value));
  const promotionMoveOrganizationTypes = unpackMaybes(
    promotionMoveOrganizationType,
  ).map((interest) => String(interest.value));
  const mentorshipInterests = unpackMaybes(mentorshipInterest).map((interest) =>
    String(interest.value),
  );
  const execCoachingInterests = unpackMaybes(execCoachingInterest).map(
    (interest) => String(interest.value),
  );

  const learningOpportunitiesInterestOptions = unpackMaybes(
    learningOpportunitiesInterest,
  ).map((interest) => String(interest.value));

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x1)"
    >
      {hasEmptyRequiredFields({
        lateralMoveInterest,
        promotionMoveInterest,
        mentorshipStatus,
        eligibleRetirementYearKnown,
        eligibleRetirementYear,
        execInterest,
        execCoachingStatus,
      }) && (
        <Well color="error">
          {intl.formatMessage({
            defaultMessage:
              'There are currently unanswered questions in this section. Use the "Edit" button to review and answer any relevant fields.',
            id: "mMiZ3q",
            description:
              "Message for unanswered required questions in this section",
          })}
        </Well>
      )}
      <ToggleForm.FieldDisplay
        label={careerDevelopmentMessages.lateralMoveInterest}
      >
        {empty(lateralMoveInterest)
          ? notProvided
          : intl.formatMessage(
              lateralMoveInterest
                ? {
                    defaultMessage:
                      "I’m interested in receiving opportunities for jobs at, or equivalent to, my current group and level.",
                    id: "1TFJ+r",
                    description:
                      "The lateral move interest described as interested.",
                  }
                : {
                    defaultMessage:
                      "I’m not looking for lateral movement right now.",
                    id: "55IkTu",
                    description:
                      "The lateral move interest described as not interested.",
                  },
            )}
      </ToggleForm.FieldDisplay>
      {lateralMoveInterest && (
        <>
          <ToggleForm.FieldDisplay
            label={careerDevelopmentMessages.lateralMoveTimeFrame}
          >
            {lateralMoveTimeFrame
              ? lateralMoveTimeFrame.label.localized
              : notProvided}
          </ToggleForm.FieldDisplay>
          <ToggleForm.FieldDisplay
            label={careerDevelopmentMessages.lateralMoveOrganizationType}
          >
            {lateralMoveOrganizationType ? (
              <ul data-h2-list-style="base(none)" data-h2-padding="base(0)">
                {unpackMaybes(
                  careerDevelopmentOptions?.organizationTypeInterest,
                ).map((x) => {
                  const iconValue = lateralMoveOrganizationTypes.includes(
                    x.value,
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
              </ul>
            ) : (
              notProvided
            )}
          </ToggleForm.FieldDisplay>
        </>
      )}
      <ToggleForm.FieldDisplay
        label={careerDevelopmentMessages.promotionMoveInterest}
      >
        {empty(promotionMoveInterest)
          ? notProvided
          : intl.formatMessage(
              promotionMoveInterest
                ? {
                    defaultMessage:
                      "I’m interested in receiving opportunities for promotion and advancement.",
                    id: "2tAqF/",
                    description:
                      "The promotion move interest described as interested.",
                  }
                : {
                    defaultMessage:
                      "I’m not looking for a promotion or advancement right now.",
                    id: "tXLRmG",
                    description:
                      "The promotion move interest described as not interested.",
                  },
            )}
      </ToggleForm.FieldDisplay>
      {promotionMoveInterest && (
        <>
          <ToggleForm.FieldDisplay
            label={careerDevelopmentMessages.promotionMoveTimeFrame}
          >
            {promotionMoveTimeFrame
              ? promotionMoveTimeFrame.label.localized
              : notProvided}
          </ToggleForm.FieldDisplay>
          <ToggleForm.FieldDisplay
            label={careerDevelopmentMessages.promotionMoveOrganizationType}
          >
            {promotionMoveOrganizationType ? (
              <ul data-h2-list-style="base(none)" data-h2-padding="base(0)">
                {unpackMaybes(
                  careerDevelopmentOptions?.organizationTypeInterest,
                ).map((x) => {
                  const iconValue = promotionMoveOrganizationTypes.includes(
                    x.value,
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
              </ul>
            ) : (
              notProvided
            )}
          </ToggleForm.FieldDisplay>
        </>
      )}

      <>
        <ToggleForm.FieldDisplay
          label={careerDevelopmentMessages.learningOpportunitiesInterest}
        >
          <ul data-h2-list-style="base(none)" data-h2-padding="base(0)">
            {unpackMaybes(
              careerDevelopmentOptions?.learningOpportunitiesInterest,
            ).map((x) => {
              const iconValue = Array.isArray(learningOpportunitiesInterest)
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
          </ul>
        </ToggleForm.FieldDisplay>
      </>

      <ToggleForm.FieldDisplay
        label={careerDevelopmentMessages.eligibleRetirementYearKnown}
      >
        {empty(eligibleRetirementYearKnown)
          ? notProvided
          : intl.formatMessage(
              eligibleRetirementYearKnown
                ? {
                    defaultMessage:
                      "I know the year in which I'm eligible to retire.",
                    id: "f0dhMc",
                    description:
                      "The eligible retirement year described as known.",
                  }
                : {
                    defaultMessage:
                      "I'm not sure about the year I'm eligible to retire.",
                    id: "a5YBuH",
                    description:
                      "The eligible retirement year described as unknown.",
                  },
            )}
      </ToggleForm.FieldDisplay>
      {eligibleRetirementYearKnown && (
        <ToggleForm.FieldDisplay
          label={careerDevelopmentMessages.eligibleRetirementYear}
        >
          {eligibleRetirementYear
            ? formatDate({
                date: formDateStringToDate(eligibleRetirementYear),
                formatString: "yyyy",
                intl,
              })
            : notProvided}
        </ToggleForm.FieldDisplay>
      )}
      <ToggleForm.FieldDisplay
        hasError={!mentorshipStatus}
        label={careerDevelopmentMessages.mentorshipStatus}
      >
        {mentorshipStatus
          ? intl.formatMessage(displayMentorshipStatus(mentorshipStatus))
          : notProvided}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        label={careerDevelopmentMessages.mentorshipInterest}
      >
        {mentorshipInterest ? (
          <ul data-h2-list-style="base(none)" data-h2-padding="base(0)">
            {unpackMaybes(careerDevelopmentOptions?.mentorship).map((x) => {
              const iconValue = mentorshipInterests.includes(x.value);
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
          </ul>
        ) : (
          notProvided
        )}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        hasError={empty(execInterest)}
        label={careerDevelopmentMessages.execInterest}
      >
        {empty(execInterest)
          ? notProvided
          : intl.formatMessage(
              execInterest
                ? {
                    defaultMessage:
                      "I'd like to be considered for executive-level opportunities.",
                    id: "WoZ3pB",
                    description:
                      "The executive interest described as interested.",
                  }
                : {
                    defaultMessage:
                      "I'm not interested in executive-level opportunities.",
                    id: "vFV5N8",
                    description:
                      "The executive interest described as not interested.",
                  },
            )}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        hasError={!execCoachingStatus}
        label={careerDevelopmentMessages.execCoachingStatus}
      >
        {intl.formatMessage(displayExecCoachingStatus(execCoachingStatus))}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        label={careerDevelopmentMessages.execCoachingInterest}
      >
        {execCoachingInterest ? (
          <ul data-h2-list-style="base(none)" data-h2-padding="base(0)">
            {unpackMaybes(careerDevelopmentOptions?.execCoaching).map((x) => {
              const iconValue = execCoachingInterests.includes(x.value);
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
          </ul>
        ) : (
          notProvided
        )}
      </ToggleForm.FieldDisplay>
    </div>
  );
};

export default Display;
