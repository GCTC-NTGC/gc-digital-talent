import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { EmployeeProfileCareerObjectiveFragment } from "@gc-digital-talent/graphql";
import { CardSeparator, Well } from "@gc-digital-talent/ui";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import employeeProfileMessages from "~/messages/employeeProfileMessages";
import { hasAnyEmptyFields } from "~/validators/employeeProfile/careerObjective";

interface DisplayProps {
  employeeProfile: EmployeeProfileCareerObjectiveFragment;
}

const Display = ({
  employeeProfile: {
    careerObjectiveClassification,
    careerObjectiveTargetRole,
    careerObjectiveJobTitle,
    careerObjectiveCommunity,
    careerObjectiveWorkStreams,
    careerObjectiveDepartments,
    careerObjectiveAdditionalInformation,
  },
}: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(
    commonMessages.missingOptionalInformation,
  );

  careerObjectiveWorkStreams?.sort((a, b) =>
    a.name?.localized && b.name?.localized
      ? a.name.localized.localeCompare(b.name.localized)
      : 0,
  );

  careerObjectiveDepartments?.sort((a, b) =>
    a.name?.localized && b.name?.localized
      ? a.name.localized.localeCompare(b.name.localized)
      : 0,
  );

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x1)"
    >
      {hasAnyEmptyFields({
        careerObjectiveClassification,
        careerObjectiveTargetRole,
        careerObjectiveJobTitle,
        careerObjectiveCommunity,
        careerObjectiveWorkStreams,
        careerObjectiveDepartments,
        careerObjectiveAdditionalInformation,
      }) && (
        <>
          <Well>
            {intl.formatMessage({
              defaultMessage:
                'There are currently unanswered questions in this section. Use the "Edit" button to review and answer any required fields.',
              id: "9Y3w6l",
              description: "Message for unanswered questions in this section",
            })}
          </Well>
          <CardSeparator data-h2-margin="base(0)" />
        </>
      )}
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-grid-template-columns="base(repeat(1, 1fr)) p-tablet(repeat(2, 1fr)) "
      >
        <ToggleForm.FieldDisplay
          label={intl.formatMessage(
            employeeProfileMessages.targetClassificationGroup,
          )}
        >
          {careerObjectiveClassification?.group
            ? careerObjectiveClassification.group
            : notProvided}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          label={intl.formatMessage(
            employeeProfileMessages.targetClassificationLevel,
          )}
        >
          {careerObjectiveClassification?.level
            ? careerObjectiveClassification.level.toString().padStart(2, "0")
            : notProvided}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          label={intl.formatMessage(employeeProfileMessages.targetRole)}
        >
          {careerObjectiveTargetRole?.label.localized
            ? careerObjectiveTargetRole.label.localized
            : notProvided}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          label={intl.formatMessage(employeeProfileMessages.jobTitle)}
        >
          {careerObjectiveJobTitle ? careerObjectiveJobTitle : notProvided}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          label={intl.formatMessage(employeeProfileMessages.community)}
          data-h2-grid-column="l-tablet(span 2)"
        >
          {careerObjectiveCommunity?.name?.localized
            ? careerObjectiveCommunity.name.localized
            : notProvided}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          label={intl.formatMessage(employeeProfileMessages.workStreams)}
          data-h2-grid-column="l-tablet(span 2)"
        >
          {careerObjectiveWorkStreams?.length ? (
            <ul
              data-h2-margin-bottom="base:selectors[>li:not(:last-child)](x.125)"
              data-h2-padding-left="base(x1)"
            >
              {careerObjectiveWorkStreams.map((workStream) => (
                <li key={workStream.id}>{workStream?.name?.localized}</li>
              ))}
            </ul>
          ) : (
            notProvided
          )}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          label={intl.formatMessage(employeeProfileMessages.departments)}
          data-h2-grid-column="l-tablet(span 2)"
        >
          {careerObjectiveDepartments?.length ? (
            <ul
              data-h2-margin-bottom="base:selectors[>li:not(:last-child)](x.125)"
              data-h2-padding-left="base(x1)"
            >
              {careerObjectiveDepartments.map((department) => (
                <li key={department.id}>{department?.name?.localized}</li>
              ))}
            </ul>
          ) : (
            notProvided
          )}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          label={intl.formatMessage(
            employeeProfileMessages.additionalInformationCareerObjective,
          )}
          data-h2-grid-column="l-tablet(span 2)"
        >
          {careerObjectiveAdditionalInformation
            ? careerObjectiveAdditionalInformation
            : notProvided}
        </ToggleForm.FieldDisplay>
      </div>
    </div>
  );
};

export default Display;
