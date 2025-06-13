import { useIntl } from "react-intl";

import { Well } from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { User } from "@gc-digital-talent/graphql";

import { getFullNameHtml } from "~/utils/nameUtils";

import { styles } from "./styles";

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
  const { well, label, value } = styles();

  return (
    <Well className={well()}>
      {(!!firstName || !!lastName) && (
        <p>
          <span className={label()}>
            {intl.formatMessage({
              defaultMessage: "Name",
              id: "4QyHfC",
              description: "Name label and colon",
            })}
          </span>
          <span className={value()}>
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
          <span className={label()}>
            {intl.formatMessage({
              defaultMessage: "Member of CAF",
              id: "ybzxmU",
              description: "Veteran/member label",
            })}
          </span>
          <span className={value()}>
            {getLocalizedName(armedForcesStatus.label, intl)}
          </span>
        </p>
      )}
      {citizenship && (
        <p>
          <span className={label()}>
            {intl.formatMessage({
              defaultMessage: "Citizenship",
              id: "sr20Tb",
              description: "Citizenship label",
            })}
          </span>
          <span className={value()}>
            {getLocalizedName(citizenship.label, intl)}
          </span>
        </p>
      )}
    </Well>
  );
};

export default AboutSection;
