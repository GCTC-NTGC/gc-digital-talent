import { useIntl } from "react-intl";

import { Well } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import {
  hasAllEmptyFields,
  hasEmptyRequiredFields,
} from "~/validators/profile/languageInformation";
import Display, {
  DisplayProps,
} from "~/components/Profile/components/LanguageProfile/Display";

const LanguageInformationSection = ({
  user,
}: {
  user: Pick<DisplayProps, "user">["user"];
}) => {
  const intl = useIntl();
  return (
    <Well>
      {!hasAllEmptyFields(user) && <Display user={user} />}
      {hasEmptyRequiredFields(user) && (
        <p>{intl.formatMessage(commonMessages.noInformationProvided)}</p>
      )}
    </Well>
  );
};

export default LanguageInformationSection;
