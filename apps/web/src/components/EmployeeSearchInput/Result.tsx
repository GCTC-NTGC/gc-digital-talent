import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";

import { getFullNameLabel } from "~/utils/nameUtils";
import adminMessages from "~/messages/adminMessages";

import FieldDisplay from "../FieldDisplay/FieldDisplay";
import { EmployeeSearchResult } from "./types";

export type SearchMessageCases = "base" | "emailNotification";

interface ResultProps {
  employee: EmployeeSearchResult;
  id: string;
  searchMessageCase?: SearchMessageCases;
}

const Result = ({ employee, id, searchMessageCase = "base" }: ResultProps) => {
  const intl = useIntl();

  if (!employee) return null;

  const notProvided = intl.formatMessage(commonMessages.notProvided);

  const userFoundMessageBase = intl.formatMessage(
    {
      defaultMessage:
        "It looks like {name} already has an account with us. We've auto-populated their information based on their profile.",
      id: "YYbOQz",
      description: "Message that the employee was found for a search",
    },
    {
      name:
        employee.firstName ??
        employee.lastName ??
        intl.formatMessage(commonMessages.notFound),
    },
  );
  const userFoundMessageWillEmail = intl.formatMessage(
    {
      defaultMessage:
        "It looks like {name} already has an account with us. We've auto-populated their information based on their profile. After you submit this nomination, we'll notify them by email.",
      id: "xeMOuD",
      description:
        "Message that the employee was found for a search and will be emailed",
    },
    {
      name:
        employee.firstName ??
        employee.lastName ??
        intl.formatMessage(commonMessages.notFound),
    },
  );
  let childMessageToDisplay = userFoundMessageBase;
  if (searchMessageCase === "emailNotification") {
    childMessageToDisplay = userFoundMessageWillEmail;
  }

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
          {childMessageToDisplay}
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
        {employee.department ?? notProvided}
      </FieldDisplay>
    </div>
  );
};

export default Result;
