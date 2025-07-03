import { IntlShape, useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { EmployeeProfileCareerObjectiveFragment } from "@gc-digital-talent/graphql";
import { CardSeparator, Ul, Well } from "@gc-digital-talent/ui";
import { sortAlphaBy } from "@gc-digital-talent/helpers";

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

  careerObjectiveWorkStreams?.sort(
    sortAlphaBy((workStream) => workStream.name?.localized),
  );
  careerObjectiveDepartments?.sort(
    sortAlphaBy((department) => department.name?.localized),
  );

  const isCommunityOther =
    !careerObjectiveCommunity?.id && !!careerObjectiveCommunityOther;

  return (
    <div className="flex flex-col gap-y-6">
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
          <CardSeparator space="none" />
        </>
      )}
      <div className="grid gap-6 xs:grid-cols-2">
        <ToggleForm.FieldDisplay
          label={intl.formatMessage(
            employeeProfileMessages.targetClassificationGroup,
          )}
        >
          {careerObjectiveClassification?.group ?? notProvided}
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
          {careerObjectiveJobTitle ?? notProvided}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          label={intl.formatMessage(employeeProfileMessages.community)}
          className="sm:col-span-2"
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
            className="sm:col-span-2"
          >
            {careerObjectiveCommunityOther}
          </ToggleForm.FieldDisplay>
        ) : null}
        {/* Only show work streams if the community has possible work streams to choose, or if there are some chosen already somehow */}
        {careerObjectiveCommunity?.workStreams?.length ||
        careerObjectiveWorkStreams?.length ? (
          <ToggleForm.FieldDisplay
            label={intl.formatMessage(employeeProfileMessages.workStreams)}
            className="sm:col-span-2"
          >
            {careerObjectiveWorkStreams?.length ? (
              <Ul space="sm">
                {careerObjectiveWorkStreams.map((workStream) => (
                  <li key={workStream.id}>{workStream?.name?.localized}</li>
                ))}
              </Ul>
            ) : (
              notProvided
            )}
          </ToggleForm.FieldDisplay>
        ) : null}
        <ToggleForm.FieldDisplay
          label={intl.formatMessage(employeeProfileMessages.departments)}
          className="sm:col-span-2"
        >
          {careerObjectiveDepartments?.length ? (
            <Ul space="sm">
              {careerObjectiveDepartments.map((department) => (
                <li key={department.id}>{department?.name?.localized}</li>
              ))}
            </Ul>
          ) : (
            notProvided
          )}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          label={intl.formatMessage(
            employeeProfileMessages.additionalInformationCareerObjective,
          )}
          className="sm:col-span-2"
        >
          {careerObjectiveAdditionalInformation ?? notProvided}
        </ToggleForm.FieldDisplay>
      </div>
    </div>
  );
};

export default Display;
