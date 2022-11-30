import React from "react";
import { useIntl } from "react-intl";

import Well from "@common/components/Well";
import {
  getArmedForcesStatusesAdmin,
  getCitizenshipStatusesAdmin,
} from "@common/constants/localizedConstants";
import { getFullNameHtml } from "@common/helpers/nameUtils";

import { Applicant } from "../../api/generated";

interface AdminAboutSectionProps {
  applicant: Pick<
    Applicant,
    "firstName" | "lastName" | "citizenship" | "armedForcesStatus"
  >;
}

const AdminAboutSection: React.FC<AdminAboutSectionProps> = ({
  applicant: { firstName, lastName, citizenship, armedForcesStatus },
}) => {
  const intl = useIntl();

  return (
    <div data-h2-flex-item="base(1of1) p-tablet(3of4)">
      <Well>
        {(!!firstName || !!lastName) && (
          <p>
            {intl.formatMessage({
              defaultMessage: "Name:",
              id: "DAmLhV",
              description: "Name label and colon",
            })}{" "}
            <span data-h2-font-weight="base(700)">
              {getFullNameHtml(firstName, lastName, intl)}
            </span>
          </p>
        )}
        {!firstName &&
          !lastName &&
          !citizenship &&
          armedForcesStatus === null && (
            <p>
              {intl.formatMessage({
                defaultMessage: "No information has been provided.",
                id: "/fv4O0",
                description:
                  "Message on Admin side when user not filled WorkPreferences section.",
              })}
            </p>
          )}
        {armedForcesStatus !== null && armedForcesStatus !== undefined && (
          <p>
            {intl.formatMessage({
              defaultMessage: "Member of CAF:",
              id: "Md/cQS",
              description: "Veteran/member label",
            })}{" "}
            <span data-h2-font-weight="base(700)">
              {intl.formatMessage(
                getArmedForcesStatusesAdmin(armedForcesStatus),
              )}
            </span>
          </p>
        )}
        {citizenship ? (
          <p>
            {intl.formatMessage({
              defaultMessage: "Citizenship:",
              id: "GiODgs",
              description: "Citizenship label",
            })}{" "}
            <span data-h2-font-weight="base(700)">
              {intl.formatMessage(getCitizenshipStatusesAdmin(citizenship))}
            </span>
          </p>
        ) : (
          ""
        )}
      </Well>
    </div>
  );
};

export default AdminAboutSection;
