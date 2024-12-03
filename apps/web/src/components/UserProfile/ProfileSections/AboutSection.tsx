import { useIntl } from "react-intl";

import { Well } from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
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
    <Well data-h2-display="base(grid)" data-h2-gap="base(x1)">
      {(!!firstName || !!lastName) && (
        <p>
          <span data-h2-display="base(block)">
            {intl.formatMessage({
              defaultMessage: "Name",
              id: "4QyHfC",
              description: "Name label and colon",
            })}
          </span>
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
          <span data-h2-display="base(block)">
            {intl.formatMessage({
              defaultMessage: "Member of CAF",
              id: "ybzxmU",
              description: "Veteran/member label",
            })}
          </span>
          <span data-h2-font-weight="base(700)">
            {getLocalizedName(armedForcesStatus.label, intl)}
          </span>
        </p>
      )}
      {citizenship && (
        <p>
          <span data-h2-display="base(block)">
            {intl.formatMessage({
              defaultMessage: "Citizenship",
              id: "sr20Tb",
              description: "Citizenship label",
            })}
          </span>
          <span data-h2-font-weight="base(700)">
            {getLocalizedName(citizenship.label, intl)}
          </span>
        </p>
      )}
    </Well>
  );
};

export default AboutSection;
