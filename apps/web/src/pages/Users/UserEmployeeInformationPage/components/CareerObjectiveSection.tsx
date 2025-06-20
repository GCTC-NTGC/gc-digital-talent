import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Card, Ul } from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { sortAlphaBy } from "@gc-digital-talent/helpers";

import employeeProfileMessages from "~/messages/employeeProfileMessages";

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

        {employeeProfile.careerObjectiveClassification?.group ??
          intl.formatMessage(commonMessages.notProvided)}
      </div>
      <div>
        <span data-h2-display="base(block)" data-h2-font-weight="base(700)">
          {intl.formatMessage(
            employeeProfileMessages.targetClassificationLevel,
          )}
        </span>
        {employeeProfile.careerObjectiveClassification?.level
          ? employeeProfile.careerObjectiveClassification.level
              .toString()
              .padStart(2, "0")
          : intl.formatMessage(commonMessages.notProvided)}
      </div>
      <div>
        <span data-h2-display="base(block)" data-h2-font-weight="base(700)">
          {intl.formatMessage(employeeProfileMessages.targetRole)}
        </span>
        {employeeProfile.careerObjectiveTargetRoleOther ??
          employeeProfile.careerObjectiveTargetRole?.label.localized ??
          intl.formatMessage(commonMessages.notProvided)}
      </div>
      <div>
        <span data-h2-display="base(block)" data-h2-font-weight="base(700)">
          {intl.formatMessage(employeeProfileMessages.seniorManagementStatus)}
        </span>
        {employeeProfile.careerObjectiveIsCSuiteRole
          ? intl.formatMessage(employeeProfileMessages.isCSuiteRoleTitle)
          : intl.formatMessage(commonMessages.notProvided)}
      </div>
      <div>
        <span data-h2-display="base(block)" data-h2-font-weight="base(700)">
          {intl.formatMessage(employeeProfileMessages.cSuiteRoleTitle)}
        </span>
        {employeeProfile.careerObjectiveIsCSuiteRole
          ? employeeProfile.careerObjectiveCSuiteRoleTitle?.label?.localized
          : intl.formatMessage(commonMessages.notProvided)}
      </div>
      <div>
        <span data-h2-display="base(block)" data-h2-font-weight="base(700)">
          {intl.formatMessage(employeeProfileMessages.jobTitle)}
        </span>
        {employeeProfile.careerObjectiveJobTitle ??
          intl.formatMessage(commonMessages.notProvided)}
      </div>
      <div data-h2-grid-column="l-tablet(span 2)">
        <span data-h2-display="base(block)" data-h2-font-weight="base(700)">
          {intl.formatMessage(employeeProfileMessages.community)}
        </span>
        {employeeProfile.careerObjectiveCommunity?.name?.localized ??
          intl.formatMessage(commonMessages.notProvided)}
      </div>
      {/* Only show work streams if the community has possible work streams to choose, or if there are some chosen already somehow */}
      {employeeProfile.careerObjectiveCommunity?.workStreams?.length ||
      employeeProfile.careerObjectiveWorkStreams?.length ? (
        <div data-h2-grid-column="l-tablet(span 2)">
          <span data-h2-display="base(block)" data-h2-font-weight="base(700)">
            {intl.formatMessage(employeeProfileMessages.workStreams)}
          </span>
          {employeeProfile.careerObjectiveWorkStreams?.length ? (
            <Ul space="sm">
              {employeeProfile.careerObjectiveWorkStreams.map((workStream) => (
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
        {employeeProfile.careerObjectiveDepartments?.length ? (
          <Ul space="sm">
            {employeeProfile.careerObjectiveDepartments.map((department) => (
              <li key={department.id}>{department?.name?.localized}</li>
            ))}
          </Ul>
        ) : (
          intl.formatMessage(commonMessages.notProvided)
        )}
      </div>
      <div data-h2-grid-column="l-tablet(span 2)">
        <span data-h2-display="base(block)" data-h2-font-weight="base(700)">
          {intl.formatMessage(
            employeeProfileMessages.additionalInformationCareerObjective,
          )}
        </span>
        {employeeProfile.careerObjectiveAdditionalInformation ??
          intl.formatMessage(commonMessages.notProvided)}
      </div>
    </Card>
  );
};

export default CareerObjectiveSection;
