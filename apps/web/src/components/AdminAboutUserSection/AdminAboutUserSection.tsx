import React from "react";
import { useIntl } from "react-intl";

import { Well } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getArmedForcesStatusesAdmin,
  getCitizenshipStatusesAdmin,
} from "@gc-digital-talent/i18n";
import { User } from "@gc-digital-talent/graphql";

import { getFullNameHtml } from "~/utils/nameUtils";

interface AdminAboutUserSectionProps {
  user: Pick<
    User,
    "firstName" | "lastName" | "citizenship" | "armedForcesStatus"
  >;
}

const AdminAboutUserSection = ({
  user: { firstName, lastName, citizenship, armedForcesStatus },
}: AdminAboutUserSectionProps) => {
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
            <span className="font-bold">
              {getFullNameHtml(firstName, lastName, intl)}
            </span>
          </p>
        )}
        {!firstName &&
          !lastName &&
          !citizenship &&
          armedForcesStatus === null && (
            <p>{intl.formatMessage(commonMessages.noInformationProvided)}</p>
          )}
        {armedForcesStatus !== null && armedForcesStatus !== undefined && (
          <p>
            {intl.formatMessage({
              defaultMessage: "Member of CAF:",
              id: "Md/cQS",
              description: "Veteran/member label",
            })}{" "}
            <span className="font-bold">
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
            <span className="font-bold">
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

export default AdminAboutUserSection;
