import { IntlShape, useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { EmployeeProfileCareerObjectiveFragment } from "@gc-digital-talent/graphql";
import { CardSeparator, Well } from "@gc-digital-talent/ui";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import employeeProfileMessages from "~/messages/employeeProfileMessages";
import { hasAnyEmptyFields } from "~/validators/employeeProfile/careerObjective";

import messages from "../../messages";

// bespoke rendering of community field
const handleCareerObjectiveCommunity = (
  careerObjectiveCommunityNameLocalized: string | null | undefined,
  careerObjectiveCommunityOther: string | null | undefined,
  intl: IntlShape,
): string => {
  if (careerObjectiveCommunityNameLocalized) {
    return careerObjectiveCommunityNameLocalized;
  } else if (careerObjectiveCommunityOther) {
    return intl.formatMessage(messages.otherCommunity);
  }

  return intl.formatMessage(commonMessages.missingOptionalInformation);
};

interface DisplayProps {
  employeeProfile: EmployeeProfileCareerObjectiveFragment;
}

const Display = ({
  employeeProfile: {
    careerObjectiveClassification,
    careerObjectiveTargetRole,
    careerObjectiveTargetRoleOther,
    careerObjectiveJobTitle,
    careerObjectiveCommunity,
    careerObjectiveCommunityOther,
    careerObjectiveWorkStreams,
    careerObjectiveDepartments,
    careerObjectiveAdditionalInformation,
    careerObjectiveIsCSuiteRole,
    careerObjectiveCSuiteRoleTitle,
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

  const isCommunityOther =
    !careerObjectiveCommunity?.id && !!careerObjectiveCommunityOther;

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
        careerObjectiveCommunityOther,
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
          {careerObjectiveTargetRoleOther ??
            careerObjectiveTargetRole?.label.localized ??
            notProvided}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          label={intl.formatMessage(
            employeeProfileMessages.seniorManagementStatus,
          )}
        >
          {careerObjectiveIsCSuiteRole
            ? intl.formatMessage(employeeProfileMessages.isCSuiteRoleTitle)
            : intl.formatMessage(employeeProfileMessages.isNotCSuiteRoleTitle)}
        </ToggleForm.FieldDisplay>
        {!!careerObjectiveIsCSuiteRole && (
          <ToggleForm.FieldDisplay
            label={intl.formatMessage(employeeProfileMessages.cSuiteRoleTitle)}
          >
            {careerObjectiveCSuiteRoleTitle?.label?.localized ?? notProvided}
          </ToggleForm.FieldDisplay>
        )}
        <ToggleForm.FieldDisplay
          label={intl.formatMessage(employeeProfileMessages.jobTitle)}
        >
          {careerObjectiveJobTitle ? careerObjectiveJobTitle : notProvided}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          label={intl.formatMessage(employeeProfileMessages.community)}
          data-h2-grid-column="l-tablet(span 2)"
        >
          {handleCareerObjectiveCommunity(
            careerObjectiveCommunity?.name?.localized,
            careerObjectiveCommunityOther,
            intl,
          )}
        </ToggleForm.FieldDisplay>
        {isCommunityOther ? (
          <ToggleForm.FieldDisplay
            label={intl.formatMessage(messages.otherCommunity)}
            data-h2-grid-column="l-tablet(span 2)"
          >
            {careerObjectiveCommunityOther}
          </ToggleForm.FieldDisplay>
        ) : null}
        {/* Only show work streams if the community has possible work streams to choose, or if there are some chosen already somehow */}
        {careerObjectiveCommunity?.workStreams?.length ||
        careerObjectiveWorkStreams?.length ? (
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
        ) : null}
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
