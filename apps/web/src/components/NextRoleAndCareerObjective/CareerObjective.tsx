import { useIntl } from "react-intl";

import { FragmentType, getFragment } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { sortAlphaBy } from "@gc-digital-talent/helpers";
import { Ul } from "@gc-digital-talent/ui";

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
    <div className="grid gap-6 sm:grid-cols-2">
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
        className="sm:col-span-2"
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
          className="sm:col-span-2"
        >
          {careerObjectiveCommunityOther}
        </FieldDisplay>
      ) : null}
      {/* Only show work streams if the community has possible work streams to choose, or if there are some chosen already somehow */}
      {careerObjectiveCommunity?.workStreams?.length ||
      careerObjectiveWorkStreams?.length ? (
        <FieldDisplay
          label={intl.formatMessage(employeeProfileMessages.workStreams)}
          className="sm:col-span-2"
        >
          {careerObjectiveWorkStreams?.length ? (
            <Ul>
              {careerObjectiveWorkStreams.map((workStream) => (
                <li key={workStream.id}>{workStream?.name?.localized}</li>
              ))}
            </Ul>
          ) : (
            notProvided
          )}
        </FieldDisplay>
      ) : null}
      <FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.departments)}
        className="sm:col-span-2"
      >
        {careerObjectiveDepartments?.length ? (
          <Ul>
            {careerObjectiveDepartments.map((department) => (
              <li key={department.id}>{department?.name?.localized}</li>
            ))}
          </Ul>
        ) : (
          notProvided
        )}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(
          employeeProfileMessages.additionalInformationNextRole,
        )}
        className="sm:col-span-2"
      >
        {careerObjectiveAdditionalInformation ?? notProvided}
      </FieldDisplay>
    </div>
  );
};

export default CareerObjective;
