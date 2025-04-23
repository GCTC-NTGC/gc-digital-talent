import { IntlShape, useIntl } from "react-intl";

import {
  Classification,
  Community,
  Department,
  LocalizedCSuiteRoleTitle,
  LocalizedTargetRole,
  Maybe,
  WorkStream,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import employeeProfileMessages from "~/messages/employeeProfileMessages";

import messages from "./messages";
import FieldDisplay from "../FieldDisplay/FieldDisplay";

// bespoke rendering of community field
const handleCommunity = (
  communityNameLocalized: string | null | undefined,
  communityOther: string | null | undefined,
  intl: IntlShape,
): string => {
  if (communityNameLocalized) {
    return communityNameLocalized;
  } else if (communityOther) {
    return intl.formatMessage(messages.otherCommunity);
  }

  return intl.formatMessage(commonMessages.missingOptionalInformation);
};

interface DisplayProps {
  classification?: Maybe<Classification>;
  targetRole?: Maybe<LocalizedTargetRole>;
  targetRoleOther?: Maybe<string>;
  jobTitle?: Maybe<string>;
  community?: Maybe<Community>;
  communityOther?: Maybe<string>;
  workStreams?: Maybe<WorkStream[]>;
  departments?: Maybe<Department[]>;
  additionalInformation?: Maybe<string>;
  isCSuiteRole?: Maybe<boolean>;
  cSuiteRoleTitle?: Maybe<LocalizedCSuiteRoleTitle>;
}

const Display = ({
  classification,
  targetRole,
  targetRoleOther,
  jobTitle,
  community,
  communityOther,
  workStreams,
  departments,
  additionalInformation,
  isCSuiteRole,
  cSuiteRoleTitle,
}: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(
    commonMessages.missingOptionalInformation,
  );

  workStreams?.sort((a, b) =>
    a.name?.localized && b.name?.localized
      ? a.name.localized.localeCompare(b.name.localized)
      : 0,
  );

  departments?.sort((a, b) =>
    a.name?.localized && b.name?.localized
      ? a.name.localized.localeCompare(b.name.localized)
      : 0,
  );

  const isCommunityOther = !community?.id && !!communityOther;

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
        {classification?.group ? classification.group : notProvided}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(
          employeeProfileMessages.targetClassificationLevel,
        )}
      >
        {classification?.level
          ? classification.level.toString().padStart(2, "0")
          : notProvided}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.targetRole)}
      >
        {targetRoleOther ?? targetRole?.label.localized ?? notProvided}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(
          employeeProfileMessages.seniorManagementStatus,
        )}
      >
        {isCSuiteRole
          ? intl.formatMessage(employeeProfileMessages.isCSuiteRoleTitle)
          : intl.formatMessage(employeeProfileMessages.isNotCSuiteRoleTitle)}
      </FieldDisplay>
      {!!isCSuiteRole && (
        <FieldDisplay
          label={intl.formatMessage(employeeProfileMessages.cSuiteRoleTitle)}
        >
          {cSuiteRoleTitle?.label?.localized ?? notProvided}
        </FieldDisplay>
      )}
      <FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.jobTitle)}
      >
        {jobTitle ? jobTitle : notProvided}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(employeeProfileMessages.community)}
        data-h2-grid-column="l-tablet(span 2)"
      >
        {handleCommunity(community?.name?.localized, communityOther, intl)}
      </FieldDisplay>
      {isCommunityOther ? (
        <FieldDisplay
          label={intl.formatMessage(messages.otherCommunity)}
          data-h2-grid-column="l-tablet(span 2)"
        >
          {communityOther}
        </FieldDisplay>
      ) : null}
      {/* Only show work streams if the community has possible work streams to choose, or if there are some chosen already somehow */}
      {community?.workStreams?.length || workStreams?.length ? (
        <FieldDisplay
          label={intl.formatMessage(employeeProfileMessages.workStreams)}
          data-h2-grid-column="l-tablet(span 2)"
        >
          {workStreams?.length ? (
            <ul
              data-h2-margin-bottom="base:selectors[>li:not(:last-child)](x.125)"
              data-h2-padding-left="base(x1)"
            >
              {workStreams.map((workStream) => (
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
        {departments?.length ? (
          <ul
            data-h2-margin-bottom="base:selectors[>li:not(:last-child)](x.125)"
            data-h2-padding-left="base(x1)"
          >
            {departments.map((department) => (
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
        {additionalInformation ? additionalInformation : notProvided}
      </FieldDisplay>
    </div>
  );
};

export default Display;
