import { useIntl } from "react-intl";

import { FragmentType, getFragment } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { sortAlphaBy } from "@gc-digital-talent/helpers";

import employeeProfileMessages from "~/messages/employeeProfileMessages";

import { CareerObjectiveInfo_Fragment, handleCommunity } from "./utils";
import FieldDisplay from "../FieldDisplay/FieldDisplay";
import messages from "./messages";

interface CareerObjectiveProps {
  careerObjectiveQuery: FragmentType<typeof CareerObjectiveInfo_Fragment>;
}

const CareerObjective = ({ careerObjectiveQuery }: CareerObjectiveProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(
    commonMessages.missingOptionalInformation,
  );

  const careerObjective = getFragment(
    CareerObjectiveInfo_Fragment,
    careerObjectiveQuery,
  );
  const {
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
  } = careerObjective;

  careerObjectiveWorkStreams?.sort(
    sortAlphaBy((workStream) => workStream.name?.localized),
  );

  careerObjectiveDepartments?.sort(
    sortAlphaBy((department) => department.name.localized),
  );

  const isCommunityOther =
    !careerObjectiveCommunity?.id && !!careerObjectiveCommunityOther;

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-gap="base(x1)"
      data-h2-grid-template-columns="base(repeat(1, 1fr)) p-tablet(repeat(2, 1fr)) "
    >
      <FieldDisplay
        label={intl.formatMessage(
          employeeProfileMessages.targetClassificationGroup,
        )}
      >
        {careerObjectiveClassification?.group ?? notProvided}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(
          employeeProfileMessages.targetClassificationLevel,
        )}
      >
        {careerObjectiveClassification?.level
          ? careerObjectiveClassification.level.toString().padStart(2, "0")
          : notProvided}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.targetRole)}
      >
        {careerObjectiveTargetRoleOther ??
          careerObjectiveTargetRole?.label.localized ??
          notProvided}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(
          employeeProfileMessages.seniorManagementStatus,
        )}
      >
        {careerObjectiveIsCSuiteRole
          ? intl.formatMessage(employeeProfileMessages.isCSuiteRoleTitle)
          : intl.formatMessage(employeeProfileMessages.isNotCSuiteRoleTitle)}
      </FieldDisplay>
      {!!careerObjectiveIsCSuiteRole && (
        <FieldDisplay
          label={intl.formatMessage(employeeProfileMessages.cSuiteRoleTitle)}
        >
          {careerObjectiveCSuiteRoleTitle?.label?.localized ?? notProvided}
        </FieldDisplay>
      )}
      <FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.jobTitle)}
      >
        {careerObjectiveJobTitle ?? notProvided}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.community)}
        data-h2-grid-column="l-tablet(span 2)"
      >
        {handleCommunity(
          careerObjectiveCommunity?.name?.localized,
          careerObjectiveCommunityOther,
          intl,
        )}
      </FieldDisplay>
      {isCommunityOther ? (
        <FieldDisplay
          label={intl.formatMessage(messages.otherCommunity)}
          data-h2-grid-column="l-tablet(span 2)"
        >
          {careerObjectiveCommunityOther}
        </FieldDisplay>
      ) : null}
      {/* Only show work streams if the community has possible work streams to choose, or if there are some chosen already somehow */}
      {careerObjectiveCommunity?.workStreams?.length ||
      careerObjectiveWorkStreams?.length ? (
        <FieldDisplay
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
        </FieldDisplay>
      ) : null}
      <FieldDisplay
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
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(
          employeeProfileMessages.additionalInformationNextRole,
        )}
        data-h2-grid-column="l-tablet(span 2)"
      >
        {careerObjectiveAdditionalInformation ?? notProvided}
      </FieldDisplay>
    </div>
  );
};

export default CareerObjective;
