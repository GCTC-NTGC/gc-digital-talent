import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Card, Ul } from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { sortAlphaBy } from "@gc-digital-talent/helpers";

import employeeProfileMessages from "~/messages/employeeProfileMessages";

export const NextRole_Fragment = graphql(/* GraphQL */ `
  fragment NextRole on EmployeeProfile {
    nextRoleClassification {
      group
    }
    nextRoleClassification {
      level
    }
    nextRoleTargetRoleOther
    nextRoleTargetRole {
      value
      label {
        localized
      }
    }
    nextRoleIsCSuiteRole
    nextRoleCSuiteRoleTitle {
      value
      label {
        localized
      }
    }
    nextRoleJobTitle
    nextRoleCommunity {
      name {
        localized
      }
      workStreams {
        id
      }
    }
    nextRoleWorkStreams {
      id
      name {
        localized
      }
    }
    nextRoleDepartments {
      id
      name {
        localized
      }
    }
    nextRoleAdditionalInformation
  }
`);

interface NextRoleSectionProps {
  employeeProfileQuery: FragmentType<typeof NextRole_Fragment>;
}

const NextRoleSection = ({ employeeProfileQuery }: NextRoleSectionProps) => {
  const intl = useIntl();

  const employeeProfile = getFragment(NextRole_Fragment, employeeProfileQuery);

  employeeProfile?.nextRoleWorkStreams?.sort(
    sortAlphaBy((workStream) => workStream.name?.localized),
  );
  employeeProfile?.nextRoleDepartments?.sort(
    sortAlphaBy((department) => department.name?.localized),
  );

  return (
    <Card
      data-h2-display="base(grid)"
      data-h2-gap="base(x1)"
      data-h2-grid-template-columns="base(repeat(1, 1fr)) p-tablet(repeat(2, 1fr))"
    >
      <div>
        <span data-h2-display="base(block)" data-h2-font-weight="base(700)">
          {intl.formatMessage(
            employeeProfileMessages.targetClassificationGroup,
          )}
        </span>
        {employeeProfile.nextRoleClassification?.group ??
          intl.formatMessage(commonMessages.notProvided)}
      </div>
      <div>
        <span data-h2-display="base(block)" data-h2-font-weight="base(700)">
          {intl.formatMessage(
            employeeProfileMessages.targetClassificationLevel,
          )}
        </span>
        {employeeProfile.nextRoleClassification?.level
          ? employeeProfile.nextRoleClassification.level
              .toString()
              .padStart(2, "0")
          : intl.formatMessage(commonMessages.notProvided)}
      </div>
      <div>
        <span data-h2-display="base(block)" data-h2-font-weight="base(700)">
          {intl.formatMessage(employeeProfileMessages.targetRole)}
        </span>
        {employeeProfile.nextRoleTargetRoleOther ??
          employeeProfile.nextRoleTargetRole?.label.localized ??
          intl.formatMessage(commonMessages.notProvided)}
      </div>
      <div>
        <span data-h2-display="base(block)" data-h2-font-weight="base(700)">
          {intl.formatMessage(employeeProfileMessages.seniorManagementStatus)}
        </span>
        {employeeProfile.nextRoleIsCSuiteRole
          ? intl.formatMessage(employeeProfileMessages.isCSuiteRoleTitle)
          : intl.formatMessage(commonMessages.notProvided)}
      </div>
      <div>
        <span data-h2-display="base(block)" data-h2-font-weight="base(700)">
          {intl.formatMessage(employeeProfileMessages.cSuiteRoleTitle)}
        </span>
        {employeeProfile.nextRoleIsCSuiteRole
          ? employeeProfile.nextRoleCSuiteRoleTitle?.label?.localized
          : intl.formatMessage(commonMessages.notProvided)}
      </div>
      <div>
        <span data-h2-display="base(block)" data-h2-font-weight="base(700)">
          {intl.formatMessage(employeeProfileMessages.jobTitle)}
        </span>
        {employeeProfile.nextRoleJobTitle ??
          intl.formatMessage(commonMessages.notProvided)}
      </div>
      <div data-h2-grid-column="l-tablet(span 2)">
        <span data-h2-display="base(block)" data-h2-font-weight="base(700)">
          {intl.formatMessage(employeeProfileMessages.community)}
        </span>
        {employeeProfile.nextRoleCommunity?.name?.localized ??
          intl.formatMessage(commonMessages.notProvided)}
      </div>
      {employeeProfile.nextRoleCommunity?.workStreams?.length ||
      employeeProfile.nextRoleWorkStreams?.length ? (
        <div data-h2-grid-column="l-tablet(span 2)">
          <span data-h2-display="base(block)" data-h2-font-weight="base(700)">
            {intl.formatMessage(employeeProfileMessages.workStreams)}
          </span>
          {employeeProfile.nextRoleWorkStreams?.length ? (
            <Ul space="sm">
              {employeeProfile.nextRoleWorkStreams.map((workStream) => (
                <li key={workStream.id}>{workStream?.name?.localized}</li>
              ))}
            </Ul>
          ) : (
            intl.formatMessage(commonMessages.notProvided)
          )}
        </div>
      ) : null}
      <div data-h2-grid-column="l-tablet(span 2)">
        <span data-h2-display="base(block)" data-h2-font-weight="base(700)">
          {intl.formatMessage(employeeProfileMessages.departments)}
        </span>
        {employeeProfile.nextRoleDepartments?.length ? (
          <Ul space="sm">
            {employeeProfile.nextRoleDepartments.map((department) => (
              <li key={department.id}>{department?.name?.localized}</li>
            ))}
          </Ul>
        ) : (
          intl.formatMessage(commonMessages.notProvided)
        )}
      </div>
      <div>
        <span data-h2-display="base(block)" data-h2-font-weight="base(700)">
          {intl.formatMessage(
            employeeProfileMessages.additionalInformationNextRole,
          )}
        </span>
        {employeeProfile.nextRoleAdditionalInformation ??
          intl.formatMessage(commonMessages.notProvided)}
      </div>
    </Card>
  );
};

export default NextRoleSection;
