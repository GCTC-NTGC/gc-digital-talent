import { useIntl } from "react-intl";

import type { FragmentType } from "@gc-digital-talent/graphql";
import {
  getFragment,
  GovEmployeeType,
  graphql,
} from "@gc-digital-talent/graphql";
import { empty } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";
import { TableOfContents } from "@gc-digital-talent/ui";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import EmailVerificationStatus from "~/components/Profile/components/EmailVerificationStatus";
import governmentMessages from "~/messages/governmentMessages";
import { formattedDate } from "~/utils/dateUtils";
import { wrapAbbr } from "~/utils/nameUtils";

const GovernmentInformation_Fragment = graphql(/** GraphQL */ `
  fragment GovernmentInformation on User {
    workEmail
    isWorkEmailVerified
    isGovEmployee
    govEmployeeType {
      value
      label {
        localized
      }
    }
    department {
      id
      name {
        localized
      }
    }
    currentClassification {
      groupAndLevel
    }
    govPositionType {
      value
      label {
        localized
      }
    }
    govEndDate
  }
`);

interface GovernmentInformationProps {
  query: FragmentType<typeof GovernmentInformation_Fragment>;
}

export const GOV_INFO_ID = "government-information";

const GovernmentInformation = ({ query }: GovernmentInformationProps) => {
  const intl = useIntl();
  const user = getFragment(GovernmentInformation_Fragment, query);
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const govEmployeeMessage = user?.isGovEmployee
    ? intl.formatMessage(governmentMessages.yesGovEmployee)
    : intl.formatMessage(governmentMessages.noGovEmployee);

  //check for employment type
  const isIndeterminate =
    user?.govEmployeeType?.value === GovEmployeeType.Indeterminate;

  // show end date for not indeterminate and is a gov employee
  const showEndDate = !isIndeterminate && user?.isGovEmployee;

  // format end date using utility
  const formattedEndDate = user?.govEndDate
    ? formattedDate(user?.govEndDate, intl)
    : notProvided;

  return (
    <TableOfContents.Section id={GOV_INFO_ID}>
      <div className="flex flex-col gap-y-6">
        <FieldDisplay
          hasError={empty(user?.isGovEmployee)}
          label={intl.formatMessage({
            defaultMessage: "Government employee status",
            id: "YMAXhb",
            description: "Employee status label",
          })}
        >
          {empty(user?.isGovEmployee) ? notProvided : govEmployeeMessage}
        </FieldDisplay>
        {user?.isGovEmployee && (
          <>
            <FieldDisplay label={intl.formatMessage(commonMessages.department)}>
              {user?.department ? user?.department.name.localized : notProvided}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Employment type",
                id: "xzSXz9",
                description: "Employment type label",
              })}
            >
              {user?.govEmployeeType
                ? user?.govEmployeeType.label.localized
                : notProvided}
            </FieldDisplay>
            {isIndeterminate && (
              <FieldDisplay
                label={intl.formatMessage({
                  defaultMessage: "Position type",
                  id: "0Dp1N4",
                  description: "Label for the position type radio group",
                })}
              >
                {user?.govPositionType
                  ? user?.govPositionType.label.localized
                  : notProvided}
              </FieldDisplay>
            )}
            {showEndDate && (
              <FieldDisplay
                label={intl.formatMessage({
                  defaultMessage: "Expected end date",
                  id: "0qwyH4",
                  description:
                    "Label displayed on an Experience form for expected end date input",
                })}
              >
                {formattedEndDate}
              </FieldDisplay>
            )}
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Classification",
                id: "YmWKlv",
                description: "Label for a process' classification",
              })}
            >
              {user.currentClassification?.groupAndLevel
                ? wrapAbbr(user.currentClassification.groupAndLevel, intl)
                : notProvided}
            </FieldDisplay>
            <FieldDisplay
              hasError={!user?.workEmail}
              label={intl.formatMessage({
                defaultMessage: "Work email",
                id: "tj9Dz3",
                description: "Work email label",
              })}
            >
              <div className="flex items-center gap-3">
                <span>{user?.workEmail ?? notProvided}</span>
                {user?.workEmail ? (
                  <EmailVerificationStatus
                    isEmailVerified={!!user?.isWorkEmailVerified}
                    readOnly
                  />
                ) : null}
              </div>
            </FieldDisplay>
          </>
        )}
      </div>
    </TableOfContents.Section>
  );
};

export default GovernmentInformation;
