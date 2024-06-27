import { useIntl } from "react-intl";

import { Well } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getArmedForcesStatusesAdmin,
  getCitizenshipStatusesAdmin,
} from "@gc-digital-talent/i18n";
import { User } from "@gc-digital-talent/graphql";

import { getFullNameHtml } from "~/utils/nameUtils";

interface AboutSectionProps {
  user: Pick<
    User,
    "firstName" | "lastName" | "citizenship" | "armedForcesStatus"
  >;
}

const AboutSection = ({
  user: { firstName, lastName, citizenship, armedForcesStatus },
}: AboutSectionProps) => {
  const intl = useIntl();

  return (
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
          <p>{intl.formatMessage(commonMessages.noInformationProvided)}</p>
        )}
      {armedForcesStatus !== null && armedForcesStatus !== undefined && (
        <p>
          {intl.formatMessage({
            defaultMessage: "Member of CAF:",
            id: "Md/cQS",
            description: "Veteran/member label",
          })}{" "}
          <span data-h2-font-weight="base(700)">
            {intl.formatMessage(getArmedForcesStatusesAdmin(armedForcesStatus))}
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
  );
};

export default AboutSection;
