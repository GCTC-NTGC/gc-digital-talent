import React from "react";
import { useIntl } from "react-intl";

import { Applicant, CitizenshipStatus } from "../../api/generated";

interface AdminAboutSectionProps {
  applicant: Pick<
    Applicant,
    "firstName" | "lastName" | "citizenship" | "isVeteran"
  >;
}

const AdminAboutSection: React.FC<AdminAboutSectionProps> = ({
  applicant: { firstName, lastName, citizenship, isVeteran },
}) => {
  const intl = useIntl();

  return (
    <div data-h2-flex-item="b(1of1) s(3of4)">
      <div
        data-h2-bg-color="b(lightgray)"
        data-h2-padding="b(all, m)"
        data-h2-radius="b(s)"
      >
        {(!!firstName || !!lastName) && (
          <p>
            {intl.formatMessage({
              defaultMessage: "Name:",
              description: "Name label and colon",
            })}{" "}
            <span data-h2-font-weight="b(700)">
              {firstName} {lastName}
            </span>
          </p>
        )}
        {!firstName && !lastName && !citizenship && isVeteran === null && (
          <p>
            {intl.formatMessage({
              defaultMessage: "No information has been provided.",
              description:
                "Message on Admin side when user not filled WorkPreferences section.",
            })}
          </p>
        )}
        {isVeteran !== null && (
          <p>
            {intl.formatMessage({
              defaultMessage: "Member of CAF:",
              description: "Veteran/member label",
            })}{" "}
            <span data-h2-font-weight="b(700)">
              {isVeteran
                ? intl.formatMessage({
                    defaultMessage: "Veteran or member of the CAF",
                    description:
                      "message admin side candidate profile, veteran status",
                  })
                : intl.formatMessage({
                    defaultMessage: "Not a veteran or member of the CAF",
                    description:
                      "message admin side candidate profile, not veteran status",
                  })}
            </span>
          </p>
        )}
        {citizenship ? (
          <p>
            {intl.formatMessage({
              defaultMessage: "Citizenship:",
              description: "Citizenship label",
            })}{" "}
            <span data-h2-font-weight="b(700)">
              {citizenship === CitizenshipStatus.Citizen &&
                intl.formatMessage({
                  defaultMessage: "Canadian Citizen",
                  description: "Canadian Citizen status",
                })}
              {citizenship === CitizenshipStatus.PermanentResident &&
                intl.formatMessage({
                  defaultMessage: "Permanent Resident",
                  description: "permanent resident status",
                })}
              {citizenship === CitizenshipStatus.Other &&
                intl.formatMessage({
                  defaultMessage: "Other",
                  description: "other citizenship status",
                })}
            </span>
          </p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default AdminAboutSection;
