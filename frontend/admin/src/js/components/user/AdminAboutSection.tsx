import React from "react";
import { useIntl } from "react-intl";

import type { Applicant } from "../../api/generated";

interface AdminAboutSectionProps {
  applicant: Pick<Applicant, "firstName" | "lastName">;
}

const AdminAboutSection: React.FC<AdminAboutSectionProps> = ({
  applicant: { firstName, lastName },
}) => {
  const intl = useIntl();

  return (
    <div data-h2-flex-item="base(1of1) p-tablet(3of4)">
      <div
        data-h2-background-color="base(light.dt-gray)"
        data-h2-padding="base(x1)"
        data-h2-radius="base(s)"
      >
        {(!!firstName || !!lastName) && (
          <p>
            {intl.formatMessage({
              defaultMessage: "Name:",
              description: "Name label and colon",
            })}{" "}
            <span data-h2-font-weight="base(700)">
              {firstName} {lastName}
            </span>
          </p>
        )}
        {!firstName && !lastName && (
          <p>
            {intl.formatMessage({
              defaultMessage: "No information has been provided.",
              description:
                "Message on Admin side when user not filled WorkPreferences section.",
            })}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminAboutSection;
