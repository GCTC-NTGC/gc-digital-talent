import { useIntl } from "react-intl";

import { Heading, Well } from "@gc-digital-talent/ui";

const EmployeeSearchWell = () => {
  const intl = useIntl();

  return (
    <Well>
      <Heading level="h3" size="h6" className="mt-0">
        {intl.formatMessage({
          defaultMessage: "See incorrect or outdated information?",
          id: "68Yf3f",
          description: "Heading for review of nominee's information",
        })}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Ensure the user's email address is correct. If it is, use the radio button to indicate to talent management staff that they should review the user's details.",
          id: "0MCsDL",
          description: "Description for review of nominee's information",
        })}
      </p>
    </Well>
  );
};
export default EmployeeSearchWell;
