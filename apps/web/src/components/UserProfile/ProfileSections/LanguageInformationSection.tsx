import { useIntl } from "react-intl";

import { Link, Well } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { User } from "@gc-digital-talent/graphql";

import {
  hasAllEmptyFields,
  hasEmptyRequiredFields,
} from "~/validators/profile/languageInformation";
import Display from "~/components/Profile/components/LanguageProfile/Display";

const LanguageInformationSection = ({
  user,
  editPath,
}: {
  user: User;
  editPath?: string;
}) => {
  const intl = useIntl();

  return (
    <Well>
      {!hasAllEmptyFields(user) && <Display user={user} context="admin" />}
      {hasAllEmptyFields(user) && editPath && (
        <div data-h2-flex-item="base(1of1)">
          <p>
            {intl.formatMessage({
              defaultMessage: "You haven't added any information here yet.",
              id: "SCCX7B",
              description: "Message for when no data exists for the section",
            })}
          </p>
        </div>
      )}
      {hasEmptyRequiredFields(user) && (
        <div data-h2-flex-item="base(1of1)">
          <p>
            {editPath && (
              <>
                {intl.formatMessage(commonMessages.requiredFieldsMissing)}{" "}
                <Link href={editPath}>
                  {intl.formatMessage({
                    defaultMessage: "Edit your language information options.",
                    id: "S9lNLG",
                    description:
                      "Link text to edit language information on profile.",
                  })}
                </Link>
              </>
            )}
            {!editPath && (
              <>{intl.formatMessage(commonMessages.noInformationProvided)}</>
            )}
          </p>
        </div>
      )}
    </Well>
  );
};

export default LanguageInformationSection;
