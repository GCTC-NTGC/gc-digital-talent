import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Card, Ul } from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { sortAlphaBy } from "@gc-digital-talent/helpers";

import employeeProfileMessages from "~/messages/employeeProfileMessages";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import { Field } from "@gc-digital-talent/forms";

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
    <Card className="grid gap-6 xs:grid-cols-2">
      <FieldDisplay
        label={intl.formatMessage(
          employeeProfileMessages.targetClassificationGroup,
        )}
      >
        {employeeProfile.nextRoleClassification?.group ??
          intl.formatMessage(commonMessages.notProvided)}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(
          employeeProfileMessages.targetClassificationLevel,
        )}
      >
        {employeeProfile.nextRoleClassification?.level
          ? employeeProfile.nextRoleClassification.level
              .toString()
              .padStart(2, "0")
          : intl.formatMessage(commonMessages.notProvided)}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.targetRole)}
      >
        {employeeProfile.nextRoleTargetRoleOther ??
          employeeProfile.nextRoleTargetRole?.label.localized ??
          intl.formatMessage(commonMessages.notProvided)}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(
          employeeProfileMessages.seniorManagementStatus,
        )}
      >
        {employeeProfile.nextRoleIsCSuiteRole
          ? intl.formatMessage(employeeProfileMessages.isCSuiteRoleTitle)
          : intl.formatMessage(commonMessages.notProvided)}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.cSuiteRoleTitle)}
      >
        {employeeProfile.nextRoleIsCSuiteRole
          ? employeeProfile.nextRoleCSuiteRoleTitle?.label?.localized
          : intl.formatMessage(commonMessages.notProvided)}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.jobTitle)}
      >
        {employeeProfile.nextRoleJobTitle ??
          intl.formatMessage(commonMessages.notProvided)}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.community)}
      >
        {employeeProfile.nextRoleCommunity?.name?.localized ??
          intl.formatMessage(commonMessages.notProvided)}
      </FieldDisplay>
      {employeeProfile.nextRoleCommunity?.workStreams?.length ||
      employeeProfile.nextRoleWorkStreams?.length ? (
        <FieldDisplay
          label={intl.formatMessage(employeeProfileMessages.workStreams)}
          className="xs:col-span-2"
        >
          {employeeProfile.nextRoleWorkStreams?.length ? (
            <Ul space="sm">
              {employeeProfile.nextRoleWorkStreams.map((workStream) => (
                <li key={workStream.id}>{workStream?.name?.localized}</li>
              ))}
            </Ul>
          ) : (
            intl.formatMessage(commonMessages.notProvided)
          )}
        </FieldDisplay>
      ) : null}
      <FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.departments)}
        className="xs:col-span-2"
      >
        {employeeProfile.nextRoleDepartments?.length ? (
          <Ul space="sm">
            {employeeProfile.nextRoleDepartments.map((department) => (
              <li key={department.id}>{department?.name?.localized}</li>
            ))}
          </Ul>
        ) : (
          intl.formatMessage(commonMessages.notProvided)
        )}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(
          employeeProfileMessages.additionalInformationNextRole,
        )}
        className="xs:col-span-2"
      >
        {employeeProfile.nextRoleAdditionalInformation ??
          intl.formatMessage(commonMessages.notProvided)}
      </FieldDisplay>
    </Card>
  );
};

export default NextRoleSection;
