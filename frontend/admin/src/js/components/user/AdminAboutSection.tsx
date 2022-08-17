import { getCitizenshipStatusesAdmin } from "@common/constants/localizedConstants";
import React from "react";
import { useIntl } from "react-intl";

import { Applicant } from "../../api/generated";

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
            <span data-h2-font-weight="base(700)">
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
            <span data-h2-font-weight="base(700)">
              {intl.formatMessage(getCitizenshipStatusesAdmin(citizenship))}
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
