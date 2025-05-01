import { IntlShape, useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { EmployeeProfileNextRoleFragment } from "@gc-digital-talent/graphql";
import { CardSeparator, Well } from "@gc-digital-talent/ui";
import { sortAlphaBy } from "@gc-digital-talent/helpers";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import employeeProfileMessages from "~/messages/employeeProfileMessages";
import { hasAnyEmptyFields } from "~/validators/employeeProfile/nextRole";

import messages from "../../messages";

// bespoke rendering of community field
const handleNextRoleCommunity = (
  nextRoleCommunityNameLocalized: string | null | undefined,
  nextRoleCommunityOther: string | null | undefined,
  intl: IntlShape,
): string => {
  if (nextRoleCommunityNameLocalized) {
    return nextRoleCommunityNameLocalized;
  } else if (nextRoleCommunityOther) {
    return intl.formatMessage(messages.otherCommunity);
  }

  return intl.formatMessage(commonMessages.missingOptionalInformation);
};

interface DisplayProps {
  employeeProfile: EmployeeProfileNextRoleFragment;
}

const Display = ({
  employeeProfile: {
    nextRoleClassification,
    nextRoleTargetRole,
    nextRoleTargetRoleOther,
    nextRoleJobTitle,
    nextRoleCommunity,
    nextRoleCommunityOther,
    nextRoleWorkStreams,
    nextRoleDepartments,
    nextRoleAdditionalInformation,
    nextRoleIsCSuiteRole,
    nextRoleCSuiteRoleTitle,
  },
}: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(
    commonMessages.missingOptionalInformation,
  );

  nextRoleWorkStreams?.sort(
    sortAlphaBy((workStream) => workStream.name?.localized),
  );
  nextRoleDepartments?.sort(
    sortAlphaBy((department) => department.name?.localized),
  );

  const isCommunityOther = !nextRoleCommunity?.id && !!nextRoleCommunityOther;

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x1)"
    >
      {hasAnyEmptyFields({
        nextRoleClassification,
        nextRoleTargetRole,
        nextRoleJobTitle,
        nextRoleCommunity,
        nextRoleCommunityOther,
        nextRoleWorkStreams,
        nextRoleDepartments,
        nextRoleAdditionalInformation,
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
          {nextRoleClassification?.group
            ? nextRoleClassification.group
            : notProvided}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          label={intl.formatMessage(
            employeeProfileMessages.targetClassificationLevel,
          )}
        >
          {nextRoleClassification?.level
            ? nextRoleClassification.level.toString().padStart(2, "0")
            : notProvided}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          label={intl.formatMessage(employeeProfileMessages.targetRole)}
        >
          {nextRoleTargetRoleOther ??
            nextRoleTargetRole?.label.localized ??
            notProvided}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          label={intl.formatMessage(
            employeeProfileMessages.seniorManagementStatus,
          )}
        >
          {nextRoleIsCSuiteRole
            ? intl.formatMessage(employeeProfileMessages.isCSuiteRoleTitle)
            : intl.formatMessage(employeeProfileMessages.isNotCSuiteRoleTitle)}
        </ToggleForm.FieldDisplay>
        {!!nextRoleIsCSuiteRole && (
          <ToggleForm.FieldDisplay
            label={intl.formatMessage(employeeProfileMessages.cSuiteRoleTitle)}
          >
            {nextRoleCSuiteRoleTitle?.label?.localized ?? notProvided}
          </ToggleForm.FieldDisplay>
        )}
        <ToggleForm.FieldDisplay
          label={intl.formatMessage(employeeProfileMessages.jobTitle)}
        >
          {nextRoleJobTitle ? nextRoleJobTitle : notProvided}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          label={intl.formatMessage(employeeProfileMessages.community)}
          data-h2-grid-column="l-tablet(span 2)"
        >
          {handleNextRoleCommunity(
            nextRoleCommunity?.name?.localized,
            nextRoleCommunityOther,
            intl,
          )}
        </ToggleForm.FieldDisplay>
        {isCommunityOther ? (
          <ToggleForm.FieldDisplay
            label={intl.formatMessage(messages.otherCommunity)}
            data-h2-grid-column="l-tablet(span 2)"
          >
            {nextRoleCommunityOther}
          </ToggleForm.FieldDisplay>
        ) : null}
        {/* Only show work streams if the community has possible work streams to choose, or if there are some chosen already somehow */}
        {nextRoleCommunity?.workStreams?.length ||
        nextRoleWorkStreams?.length ? (
          <ToggleForm.FieldDisplay
            label={intl.formatMessage(employeeProfileMessages.workStreams)}
            data-h2-grid-column="l-tablet(span 2)"
          >
            {nextRoleWorkStreams?.length ? (
              <ul
                data-h2-margin-bottom="base:selectors[>li:not(:last-child)](x.125)"
                data-h2-padding-left="base(x1)"
              >
                {nextRoleWorkStreams.map((workStream) => (
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
          {nextRoleDepartments?.length ? (
            <ul
              data-h2-margin-bottom="base:selectors[>li:not(:last-child)](x.125)"
              data-h2-padding-left="base(x1)"
            >
              {nextRoleDepartments.map((department) => (
                <li key={department.id}>{department?.name?.localized}</li>
              ))}
            </ul>
          ) : (
            notProvided
          )}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          label={intl.formatMessage(
            employeeProfileMessages.additionalInformationNextRole,
          )}
          data-h2-grid-column="l-tablet(span 2)"
        >
          {nextRoleAdditionalInformation
            ? nextRoleAdditionalInformation
            : notProvided}
        </ToggleForm.FieldDisplay>
      </div>
    </div>
  );
};

export default Display;
