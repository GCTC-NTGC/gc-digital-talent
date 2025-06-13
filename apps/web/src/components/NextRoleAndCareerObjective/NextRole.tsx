import { useIntl } from "react-intl";

import { FragmentType, getFragment } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { sortAlphaBy } from "@gc-digital-talent/helpers";
import { Ul } from "@gc-digital-talent/ui";

import employeeProfileMessages from "~/messages/employeeProfileMessages";

import { NextRoleInfo_Fragment, handleCommunity } from "./utils";
import FieldDisplay from "../FieldDisplay/FieldDisplay";
import messages from "./messages";

interface NextRoleProps {
  nextRoleQuery: FragmentType<typeof NextRoleInfo_Fragment>;
}

const NextRole = ({ nextRoleQuery }: NextRoleProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(
    commonMessages.missingOptionalInformation,
  );

  const nextRole = getFragment(NextRoleInfo_Fragment, nextRoleQuery);
  const {
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
  } = nextRole;

  nextRoleWorkStreams?.sort(
    sortAlphaBy((workStream) => workStream.name?.localized),
  );

  nextRoleDepartments?.sort(
    sortAlphaBy((department) => department.name.localized),
  );

  const isCommunityOther = !nextRoleCommunity?.id && !!nextRoleCommunityOther;

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FieldDisplay
        label={intl.formatMessage(
          employeeProfileMessages.targetClassificationGroup,
        )}
      >
        {nextRoleClassification?.group ?? notProvided}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(
          employeeProfileMessages.targetClassificationLevel,
        )}
      >
        {nextRoleClassification?.level
          ? nextRoleClassification.level.toString().padStart(2, "0")
          : notProvided}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.targetRole)}
      >
        {nextRoleTargetRoleOther ??
          nextRoleTargetRole?.label.localized ??
          notProvided}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(
          employeeProfileMessages.seniorManagementStatus,
        )}
      >
        {nextRoleIsCSuiteRole
          ? intl.formatMessage(employeeProfileMessages.isCSuiteRoleTitle)
          : intl.formatMessage(employeeProfileMessages.isNotCSuiteRoleTitle)}
      </FieldDisplay>
      {!!nextRoleIsCSuiteRole && (
        <FieldDisplay
          label={intl.formatMessage(employeeProfileMessages.cSuiteRoleTitle)}
        >
          {nextRoleCSuiteRoleTitle?.label?.localized ?? notProvided}
        </FieldDisplay>
      )}
      <FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.jobTitle)}
      >
        {nextRoleJobTitle ?? notProvided}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.community)}
        className="sm:col-span-2"
      >
        {handleCommunity(
          nextRoleCommunity?.name?.localized,
          nextRoleCommunityOther,
          intl,
        )}
      </FieldDisplay>
      {isCommunityOther ? (
        <FieldDisplay
          label={intl.formatMessage(messages.otherCommunity)}
          className="sm:col-span-2"
        >
          {nextRoleCommunityOther}
        </FieldDisplay>
      ) : null}
      {/* Only show work streams if the community has possible work streams to choose, or if there are some chosen already somehow */}
      {nextRoleCommunity?.workStreams?.length || nextRoleWorkStreams?.length ? (
        <FieldDisplay
          label={intl.formatMessage(employeeProfileMessages.workStreams)}
          className="sm:col-span-2"
        >
          {nextRoleWorkStreams?.length ? (
            <Ul>
              {nextRoleWorkStreams.map((workStream) => (
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
        {nextRoleDepartments?.length ? (
          <Ul>
            {nextRoleDepartments.map((department) => (
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
        {nextRoleAdditionalInformation ?? notProvided}
      </FieldDisplay>
    </div>
  );
};

export default NextRole;
