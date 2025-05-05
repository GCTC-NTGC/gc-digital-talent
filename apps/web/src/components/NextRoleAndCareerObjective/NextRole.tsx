import { useIntl } from "react-intl";

import { FragmentType, getFragment } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { sortAlphaBy } from "@gc-digital-talent/helpers";

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
        {nextRoleClassification?.group
          ? nextRoleClassification.group
          : notProvided}
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
        data-h2-grid-column="l-tablet(span 2)"
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
          data-h2-grid-column="l-tablet(span 2)"
        >
          {nextRoleCommunityOther}
        </FieldDisplay>
      ) : null}
      {/* Only show work streams if the community has possible work streams to choose, or if there are some chosen already somehow */}
      {nextRoleCommunity?.workStreams?.length || nextRoleWorkStreams?.length ? (
        <FieldDisplay
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
        </FieldDisplay>
      ) : null}
      <FieldDisplay
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
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(
          employeeProfileMessages.additionalInformationNextRole,
        )}
        data-h2-grid-column="l-tablet(span 2)"
      >
        {nextRoleAdditionalInformation ?? notProvided}
      </FieldDisplay>
    </div>
  );
};

export default NextRole;
