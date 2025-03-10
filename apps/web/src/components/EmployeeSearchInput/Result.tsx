import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import { getFullNameLabel } from "~/utils/nameUtils";
import adminMessages from "~/messages/adminMessages";

import FieldDisplay from "../FieldDisplay/FieldDisplay";

const EmployeeSearchResult_Fragment = graphql(/* GraphQL */ `
  fragment EmployeeSearchResult on BasicGovEmployeeProfile {
    firstName
    lastName
    role
    department {
      name {
        localized
      }
    }
  }
`);

interface ResultProps {
  resultQuery?: FragmentType<typeof EmployeeSearchResult_Fragment>;
  id: string;
}

const Result = ({ resultQuery, id }: ResultProps) => {
  const intl = useIntl();
  const employee = getFragment(EmployeeSearchResult_Fragment, resultQuery);

  if (!employee) return null;

  const notProvided = intl.formatMessage(commonMessages.notProvided);

  return (
    <div
      id={id}
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(1fr) p-tablet(1fr 1fr)"
      data-h2-gap="base(x1)"
    >
      <div data-h2-grid-column="p-tablet(span 2)">
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "We found a user with this email address",
            id: "hFm9sL",
            description: "Label for when an employee was found",
          })}
        >
          {intl.formatMessage(
            {
              defaultMessage:
                "It looks like {name} already has an account with us. We've auto-populated their information based on their profile. After you submit this nomination, we'll notify them and they'll be able to review the submission details and progress.",
              id: "2ExR2X",
              description: "Message about the employee found for a search",
            },
            {
              name:
                employee.firstName ??
                employee.lastName ??
                intl.formatMessage(commonMessages.notFound),
            },
          )}
        </FieldDisplay>
      </div>
      <FieldDisplay label={intl.formatMessage(commonMessages.name)}>
        {getFullNameLabel(employee.firstName, employee.lastName, intl)}
      </FieldDisplay>
      <FieldDisplay label={intl.formatMessage(adminMessages.jobTitle)}>
        {employee.role ?? notProvided}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage({
          defaultMessage: "Department or agency",
          id: "nym1M2",
          description: "Label for an employees department",
        })}
      >
        {employee.department?.name.localized ?? notProvided}
      </FieldDisplay>
    </div>
  );
};

export default Result;
