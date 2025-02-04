import { useIntl } from "react-intl";

import {
  commonMessages,
  ExecInterest,
  getExecCoachingInterest,
  getExecInterest,
  getMentorshipInterest,
  getMoveInterest,
  getOrganizationTypeInterest,
} from "@gc-digital-talent/i18n";
import {
  EmployeeProfileCareerDevelopmentFragment,
  EmployeeProfileCareerDevelopmentOptionsFragment,
} from "@gc-digital-talent/graphql";
import { Well } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import employeeProfileMessages from "~/messages/employeeProfileMessages";
import { hasAnyEmptyFields } from "~/validators/employeeProfile/careerDevelopment";

import { displayExecCoachingStatus, displayMentorshipStatus } from "./utils";
import BoolCheckIcon from "./BoolCheckIcon";

interface DisplayProps {
  employeeProfile: EmployeeProfileCareerDevelopmentFragment;
  careerDevelopmentOptions: EmployeeProfileCareerDevelopmentOptionsFragment;
}

const Display = ({
  employeeProfile: {
    organizationTypeInterest,
    moveInterest,
    mentorshipStatus,
    mentorshipInterest,
    execInterest,
    execCoachingStatus,
    execCoachingInterest,
  },
  careerDevelopmentOptions,
}: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);

  const organizationTypeInterests = unpackMaybes(
    careerDevelopmentOptions?.organizationTypeInterest,
  ).map((x) => {
    const iconValue = organizationTypeInterest
      ?.map((interest) => interest.value as string)
      .includes(x.value);
    return (
      <li key={x.value}>
        <BoolCheckIcon value={iconValue}>
          {intl.formatMessage(getOrganizationTypeInterest(x.value, iconValue))}
        </BoolCheckIcon>
      </li>
    );
  });

  const moveInterests = unpackMaybes(
    careerDevelopmentOptions?.moveInterest,
  ).map((x) => {
    const iconValue = moveInterest
      ?.map((interest) => interest.value as string)
      .includes(x.value);
    return (
      <li key={x.value}>
        <BoolCheckIcon value={iconValue}>
          {intl.formatMessage(getMoveInterest(x.value, iconValue))}
        </BoolCheckIcon>
      </li>
    );
  });

  const mentorshipInterests = unpackMaybes(
    careerDevelopmentOptions?.mentorship,
  ).map((x) => {
    const iconValue = mentorshipInterest
      ?.map((interest) => interest.value as string)
      .includes(x.value);
    return (
      <li key={x.value}>
        <BoolCheckIcon value={iconValue}>
          {intl.formatMessage(getMentorshipInterest(x.value, iconValue))}
        </BoolCheckIcon>
      </li>
    );
  });

  const execCoachingInterests = unpackMaybes(
    careerDevelopmentOptions?.execCoaching,
  ).map((x) => {
    const iconValue = execCoachingInterest
      ?.map((interest) => interest.value as string)
      .includes(x.value);
    return (
      <li key={x.value}>
        <BoolCheckIcon value={iconValue}>
          {intl.formatMessage(getExecCoachingInterest(x.value, iconValue))}
        </BoolCheckIcon>
      </li>
    );
  });

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x1)"
    >
      {hasAnyEmptyFields({
        organizationTypeInterest,
        moveInterest,
        mentorshipStatus,
        mentorshipInterest,
        execInterest,
        execCoachingStatus,
        execCoachingInterest,
      }) && (
        <Well>
          {intl.formatMessage({
            defaultMessage:
              'There are currently unanswered optional questions in this section. Use the "Edit" button to review and answer any relevant fields.',
            id: "PEH7og",
            description:
              "Message for unanswered optional questions in this section",
          })}
        </Well>
      )}
      <ToggleForm.FieldDisplay
        label={intl.formatMessage(
          employeeProfileMessages.organizationTypeInterest,
        )}
      >
        {organizationTypeInterest?.length ? (
          <ul data-h2-list-style="base(none)" data-h2-padding="base(0)">
            {organizationTypeInterests}
          </ul>
        ) : (
          notProvided
        )}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.moveInterest)}
      >
        {moveInterest?.length ? (
          <ul data-h2-list-style="base(none)" data-h2-padding="base(0)">
            {moveInterests}
          </ul>
        ) : (
          notProvided
        )}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.mentorshipStatus)}
      >
        {intl.formatMessage(displayMentorshipStatus(mentorshipStatus))}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.mentorshipInterest)}
      >
        {mentorshipInterest?.length ? (
          <ul data-h2-list-style="base(none)" data-h2-padding="base(0)">
            {mentorshipInterests}
          </ul>
        ) : (
          notProvided
        )}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.execInterest)}
      >
        {intl.formatMessage(
          getExecInterest(
            execInterest
              ? ExecInterest.INTERESTED
              : ExecInterest.NOT_INTERESTED,
          ),
        )}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.execCoachingStatus)}
      >
        {intl.formatMessage(displayExecCoachingStatus(execCoachingStatus))}
      </ToggleForm.FieldDisplay>
      <ToggleForm.FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.execCoachingInterest)}
      >
        {execCoachingInterest?.length ? (
          <ul data-h2-list-style="base(none)" data-h2-padding="base(0)">
            {execCoachingInterests}
          </ul>
        ) : (
          notProvided
        )}
      </ToggleForm.FieldDisplay>
    </div>
  );
};

export default Display;
