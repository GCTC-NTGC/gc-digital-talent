import { useIntl } from "react-intl";

import {
  commonMessages,
  getExecCoachingInterest,
  getMentorshipInterest,
  getMoveInterest,
  getOrganizationTypeInterest,
} from "@gc-digital-talent/i18n";
import { FragmentType, getFragment } from "@gc-digital-talent/graphql";
import { Well } from "@gc-digital-talent/ui";
import { empty, unpackMaybes } from "@gc-digital-talent/helpers";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import { hasAnyEmptyFields } from "~/validators/employeeProfile/careerDevelopment";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";

import {
  displayExecCoachingStatus,
  displayMentorshipStatus,
  EmployeeProfileCareerDevelopment_Fragment,
  EmployeeProfileCareerDevelopmentOptions_Fragment,
  getLabels,
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
  const labels = getLabels(intl);
  const notProvided = intl.formatMessage(commonMessages.notProvided);

  const {
    organizationTypeInterest,
    moveInterest,
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

  const moveInterests = unpackMaybes(moveInterest).map((interest) =>
    String(interest.value),
  );
  const organizationTypeInterests = unpackMaybes(organizationTypeInterest).map(
    (interest) => String(interest.value),
  );
  const mentorshipInterests = unpackMaybes(mentorshipInterest).map((interest) =>
    String(interest.value),
  );
  const execCoachingInterests = unpackMaybes(execCoachingInterest).map(
    (interest) => String(interest.value),
  );
  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x1)"
    >
      {hasAnyEmptyFields({
        mentorshipStatus,
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
      <ToggleForm.FieldDisplay label={labels.moveInterest}>
        {moveInterest ? (
          <ul data-h2-list-style="base(none)" data-h2-padding="base(0)">
            {unpackMaybes(careerDevelopmentOptions?.moveInterest).map((x) => {
              const iconValue = moveInterests.includes(x.value);
              return (
                <li key={x.value}>
                  <BoolCheckIcon value={iconValue}>
                    {intl.formatMessage(getMoveInterest(x.value, iconValue))}
                  </BoolCheckIcon>
                </li>
              );
            })}
          </ul>
        ) : (
          notProvided
        )}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay label={labels.organizationTypeInterest}>
        {organizationTypeInterest ? (
          <ul data-h2-list-style="base(none)" data-h2-padding="base(0)">
            {unpackMaybes(
              careerDevelopmentOptions?.organizationTypeInterest,
            ).map((x) => {
              const iconValue = organizationTypeInterests.includes(x.value);
              return (
                <li key={x.value}>
                  <BoolCheckIcon value={iconValue}>
                    {intl.formatMessage(
                      getOrganizationTypeInterest(x.value, iconValue),
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
        hasError={!mentorshipStatus}
        label={labels.mentorshipStatus}
      >
        {intl.formatMessage(displayMentorshipStatus(mentorshipStatus))}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay label={labels.mentorshipInterest}>
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
        label={labels.execInterest}
      >
        {empty(execInterest)
          ? notProvided
          : intl.formatMessage(
              execInterest
                ? {
                    defaultMessage:
                      "I'd like to be considered for executive level opportunities.",
                    id: "PffQVS",
                    description:
                      "The executive interest described as interested.",
                  }
                : {
                    defaultMessage:
                      "I'm not interested in executive level opportunities.",
                    id: "0xmhEq",
                    description:
                      "The executive interest described as not interested.",
                  },
            )}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        hasError={!execCoachingStatus}
        label={labels.execCoachingStatus}
      >
        {intl.formatMessage(displayExecCoachingStatus(execCoachingStatus))}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay label={labels.execCoachingInterest}>
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
