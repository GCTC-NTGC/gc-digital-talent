import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Card, Ul } from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { sortAlphaBy } from "@gc-digital-talent/helpers";

import employeeProfileMessages from "~/messages/employeeProfileMessages";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

export const CareerObjective_Fragment = graphql(/* GraphQL */ `
  fragment CareerObjective on EmployeeProfile {
    careerObjectiveClassification {
      group
    }
    careerObjectiveClassification {
      level
    }
    careerObjectiveTargetRoleOther
    careerObjectiveTargetRole {
      value
      label {
        localized
      }
    }
    careerObjectiveIsCSuiteRole
    careerObjectiveCSuiteRoleTitle {
      value
      label {
        localized
      }
    }
    careerObjectiveJobTitle
    careerObjectiveCommunity {
      name {
        localized
      }
      workStreams {
        id
      }
    }
    careerObjectiveWorkStreams {
      id
      name {
        localized
      }
    }
    careerObjectiveDepartments {
      id
      name {
        localized
      }
    }
    careerObjectiveAdditionalInformation
  }
`);

interface CareerObjectiveSectionProps {
  employeeProfileQuery: FragmentType<typeof CareerObjective_Fragment>;
}

const CareerObjectiveSection = ({
  employeeProfileQuery,
}: CareerObjectiveSectionProps) => {
  const intl = useIntl();

  const employeeProfile = getFragment(
    CareerObjective_Fragment,
    employeeProfileQuery,
  );

  employeeProfile?.careerObjectiveWorkStreams?.sort(
    sortAlphaBy((workStream) => workStream.name?.localized),
  );
  employeeProfile?.careerObjectiveDepartments?.sort(
    sortAlphaBy((department) => department.name?.localized),
  );

  return (
    <Card className="grid gap-6 xs:grid-cols-2">
      <FieldDisplay
        label={intl.formatMessage(
          employeeProfileMessages.targetClassificationGroup,
        )}
      >
        {employeeProfile.careerObjectiveClassification?.group ??
          intl.formatMessage(commonMessages.notProvided)}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(
          employeeProfileMessages.targetClassificationLevel,
        )}
      >
        {employeeProfile.careerObjectiveClassification?.level
          ? employeeProfile.careerObjectiveClassification.level
              .toString()
              .padStart(2, "0")
          : intl.formatMessage(commonMessages.notProvided)}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.targetRole)}
      >
        {employeeProfile.careerObjectiveTargetRoleOther ??
          employeeProfile.careerObjectiveTargetRole?.label.localized ??
          intl.formatMessage(commonMessages.notProvided)}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(
          employeeProfileMessages.seniorManagementStatus,
        )}
      >
        {employeeProfile.careerObjectiveIsCSuiteRole
          ? intl.formatMessage(employeeProfileMessages.isCSuiteRoleTitle)
          : intl.formatMessage(commonMessages.notProvided)}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.cSuiteRoleTitle)}
      >
        {employeeProfile.careerObjectiveIsCSuiteRole
          ? employeeProfile.careerObjectiveCSuiteRoleTitle?.label?.localized
          : intl.formatMessage(commonMessages.notProvided)}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.jobTitle)}
      >
        {employeeProfile.careerObjectiveJobTitle ??
          intl.formatMessage(commonMessages.notProvided)}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.community)}
        className="xs:col-span-2"
      >
        {employeeProfile.careerObjectiveCommunity?.name?.localized ??
          intl.formatMessage(commonMessages.notProvided)}
      </FieldDisplay>
      {/* Only show work streams if the community has possible work streams to choose, or if there are some chosen already somehow */}
      {employeeProfile.careerObjectiveCommunity?.workStreams?.length ||
      employeeProfile.careerObjectiveWorkStreams?.length ? (
        <FieldDisplay
          label={intl.formatMessage(employeeProfileMessages.workStreams)}
          className="xs:col-span-2"
        >
          {employeeProfile.careerObjectiveWorkStreams?.length ? (
            <Ul space="sm">
              {employeeProfile.careerObjectiveWorkStreams.map((workStream) => (
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
        {employeeProfile.careerObjectiveDepartments?.length ? (
          <Ul space="sm">
            {employeeProfile.careerObjectiveDepartments.map((department) => (
              <li key={department.id}>{department?.name?.localized}</li>
            ))}
          </Ul>
        ) : (
          intl.formatMessage(commonMessages.notProvided)
        )}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(
          employeeProfileMessages.additionalInformationCareerObjective,
        )}
        className="xs:col-span-2"
      >
        {employeeProfile.careerObjectiveAdditionalInformation ??
          intl.formatMessage(commonMessages.notProvided)}
      </FieldDisplay>
    </Card>
  );
};

export default CareerObjectiveSection;
