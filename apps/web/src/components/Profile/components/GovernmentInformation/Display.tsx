import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import ExclamationCircleIcon from "@heroicons/react/24/outline/ExclamationCircleIcon";

import { commonMessages } from "@gc-digital-talent/i18n";
import { empty } from "@gc-digital-talent/helpers";
import {
  FragmentType,
  getFragment,
  graphql,
  Maybe,
  Pool,
  GovEmployeeType,
} from "@gc-digital-talent/graphql";
import { Heading, Well } from "@gc-digital-talent/ui";

import { wrapAbbr } from "~/utils/nameUtils";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import useRoutes from "~/hooks/useRoutes";
import governmentMessages from "~/messages/governmentMessages";
import { formattedDate } from "~/utils/dateUtils";

import EmailVerificationStatus from "../EmailVerificationStatus";
import { getSectionTitle } from "../../utils";

export const GovernmentInformationDisplay_Fragment = graphql(/** GraphQL */ `
  fragment GovernmentInformationDisplay on User {
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
      group
      level
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

interface DisplayProps {
  query: FragmentType<typeof GovernmentInformationDisplay_Fragment>;
  showEmailVerification?: boolean;
  readOnly?: boolean;
  showEmail?: boolean;
  pool?: Maybe<Pool>;
}

const Display = ({
  query,
  pool,
  showEmailVerification = false,
  readOnly = false,
  showEmail = false,
}: DisplayProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const routes = useRoutes();
  const user = getFragment(GovernmentInformationDisplay_Fragment, query);
  const {
    workEmail,
    isWorkEmailVerified,
    isGovEmployee,
    department,
    govEmployeeType,
    currentClassification,
    govPositionType,
    govEndDate,
  } = user;

  const notProvided = intl.formatMessage(commonMessages.notProvided);

  const govEmployeeMessage = isGovEmployee
    ? intl.formatMessage(governmentMessages.yesGovEmployee)
    : intl.formatMessage(governmentMessages.noGovEmployee);

  const handleVerifyNowClick = async () => {
    await navigate(routes.verifyWorkEmail());
  };

  //check for employment type
  const isIndeterminate =
    govEmployeeType?.value === GovEmployeeType.Indeterminate;

  // show end date for not indeterminate and is a gov employee
  const showEndDate = !isIndeterminate && isGovEmployee;

  // format end date using utility
  const formattedEndDate = govEndDate
    ? formattedDate(govEndDate, intl)
    : notProvided;

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col items-start justify-between gap-6 xs:flex-row xs:items-center">
        <Heading
          icon={ExclamationCircleIcon}
          color="warning"
          level={pool ? "h3" : "h2"}
          size={pool ? "h4" : "h3"}
        >
          {intl.formatMessage(getSectionTitle("government"))}
        </Heading>
      </div>
      <div className="rounded-md bg-white p-6 text-black shadow-lg dark:bg-gray-600 dark:text-white">
        <Well color="warning">
          <p className="mb-3 font-bold">
            {intl.formatMessage({
              defaultMessage: "This information is going away",
              id: "Ui7CNt",
              description:
                "Title warning message for government information getting removed",
            })}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "You can now add Government of Canada employment details directly on your career experience. We will keep the details here on your file until you add new ones on your current work experience.",
              id: "dvil3O",
              description:
                "Description for warning message when the government information section is getting removed.",
            })}
          </p>
        </Well>
        <div className="mt-6 flex flex-col gap-y-6">
          <FieldDisplay
            hasError={empty(isGovEmployee)}
            label={intl.formatMessage({
              defaultMessage: "Government employee status",
              id: "YMAXhb",
              description: "Employee status label",
            })}
          >
            {empty(isGovEmployee) ? notProvided : govEmployeeMessage}
          </FieldDisplay>
          {isGovEmployee && (
            <>
              <FieldDisplay
                label={intl.formatMessage(commonMessages.department)}
              >
                {department ? department.name.localized : notProvided}
              </FieldDisplay>
              <FieldDisplay
                label={intl.formatMessage({
                  defaultMessage: "Employment type",
                  id: "xzSXz9",
                  description: "Employment type label",
                })}
              >
                {govEmployeeType
                  ? govEmployeeType.label.localized
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
                  {govPositionType
                    ? govPositionType.label.localized
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
                  defaultMessage: "Current group and classification",
                  id: "EHh5pb",
                  description: "Current group and classification label",
                })}
              >
                {!!currentClassification?.group &&
                !!currentClassification?.level
                  ? wrapAbbr(
                      `${currentClassification?.group}-${currentClassification?.level < 10 ? "0" : ""}${currentClassification?.level}`,
                      intl,
                    )
                  : notProvided}
              </FieldDisplay>
              {showEmail && (
                <FieldDisplay
                  hasError={!workEmail}
                  label={intl.formatMessage({
                    defaultMessage: "Work email",
                    id: "tj9Dz3",
                    description: "Work email label",
                  })}
                >
                  <div className="flex items-center gap-3">
                    <span>{workEmail ?? notProvided}</span>
                    {showEmailVerification && workEmail ? (
                      <EmailVerificationStatus
                        isEmailVerified={!!isWorkEmailVerified}
                        onClickVerify={handleVerifyNowClick}
                        readOnly={readOnly}
                      />
                    ) : null}
                  </div>
                </FieldDisplay>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Display;
