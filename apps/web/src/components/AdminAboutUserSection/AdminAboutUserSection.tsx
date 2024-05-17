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
    <div>
      <Well>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
        </div>
      </Well>
    </div>
  );
};

export default AdminAboutUserSection;
