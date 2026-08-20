import { useIntl } from "react-intl";

import { assertUnreachable } from "@gc-digital-talent/helpers";
import { Notice, Ul } from "@gc-digital-talent/ui";

interface ErrorNoticeProps {
  reason: "not-shared-with-community" | "not-verified-gov-employee";
}

const ErrorNotice = ({ reason }: ErrorNoticeProps) => {
  const intl = useIntl();

  if (reason == "not-shared-with-community") {
    return (
      <Notice.Root color="error" className="mt-9">
        <Notice.Title>
          {intl.formatMessage({
            defaultMessage:
              "This nominee has not agreed to share their information with your community",
            id: "4ujr5X",
            description: "Null message for nominee profile",
          })}
        </Notice.Title>
        <Notice.Content>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Nominees can agree to provide access to their profile using the “Functional communities” tool on their dashboard.",
              id: "8plD42",
              description: "Null secondary message for nominee profile",
            })}
          </p>
        </Notice.Content>
      </Notice.Root>
    );
  }

  if (reason == "not-verified-gov-employee") {
    return (
      <Notice.Root color="error" className="mt-9">
        <Notice.Title>
          {intl.formatMessage({
            defaultMessage:
              "The nominee is no longer a verified Government of Canada employee",
            id: "PbTf7L",
            description: "Null message for nominee profile",
          })}
        </Notice.Title>
        <Notice.Content>
          <p className="mb-3">
            {intl.formatMessage({
              defaultMessage:
                "In order to view the nominee’s profile information and career experience, please reach out to the nominator and have them contact the nominee to confirm whether the nominee is still an employee.",
              id: "FcINAB",
              description: "Null secondary message for nominee profile",
            })}
          </p>
          <Ul space="md">
            <li>
              {intl.formatMessage({
                defaultMessage:
                  "If they are, have them verify their employee status by confirming their work email and adding current Government of Canada work experience.",
                id: "1mNea9",
                description: "Null secondary message for nominee profile",
              })}
            </li>
            <li>
              {intl.formatMessage({
                defaultMessage:
                  "If they aren’t, mark this nomination as “Not supported”.",
                id: "hOiaIL",
                description: "Null secondary message for nominee profile",
              })}
            </li>
          </Ul>
        </Notice.Content>
      </Notice.Root>
    );
  }

  return assertUnreachable(reason);
};

export default ErrorNotice;
