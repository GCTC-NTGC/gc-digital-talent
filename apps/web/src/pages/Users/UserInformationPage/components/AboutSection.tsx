import { useIntl } from "react-intl";

import { Link, Well } from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";

import { getFullNameHtml } from "~/utils/nameUtils";
import { getLabels } from "~/components/Profile/components/LanguageProfile/utils";

import { BasicUserInformationProps } from "../types";

const AboutSection = ({ user }: BasicUserInformationProps) => {
  const intl = useIntl();
  const labels = getLabels(intl);
  return (
    <Well className="grid gap-6 wrap-anywhere xs:grid-cols-2 lg:grid-cols-3">
      <div>
        <p className="font-bold">
          {intl.formatMessage(commonMessages.name)}
          {intl.formatMessage(commonMessages.dividingColon)}
        </p>
        <p>{getFullNameHtml(user.firstName, user.lastName, intl)}</p>
      </div>
      <div>
        <p className="font-bold">
          {intl.formatMessage(commonMessages.email)}
          {intl.formatMessage(commonMessages.dividingColon)}
        </p>
        <p>{user.email}</p>
      </div>
      <div>
        <p className="font-bold">
          {intl.formatMessage(commonMessages.preferredCommunicationLanguage)}
          {intl.formatMessage(commonMessages.dividingColon)}
        </p>
        <p>{getLocalizedName(user.preferredLang?.label, intl)}</p>
      </div>
      <div>
        <p className="font-bold">
          {labels.prefSpokenInterviewLang}
          {intl.formatMessage(commonMessages.dividingColon)}
        </p>
        <p>
          {getLocalizedName(
            user.preferredLanguageForInterview?.label,
            intl,
            true,
          )}
        </p>
      </div>
      <div>
        <p className="font-bold">
          {labels.prefWrittenExamLang}
          {intl.formatMessage(commonMessages.dividingColon)}
        </p>
        <p>
          {getLocalizedName(user.preferredLanguageForExam?.label, intl, true)}
        </p>
      </div>
      <div>
        <p className="font-bold">
          {intl.formatMessage({
            defaultMessage: "Phone:",
            id: "EnvwAC",
            description: "Display text for the phone number field on users",
          })}
        </p>
        <p>
          {user.telephone ? (
            <Link
              external
              href={`tel:${user.telephone}`}
              aria-label={user.telephone.replace(/.{1}/g, "$& ")}
            >
              {user.telephone}
            </Link>
          ) : (
            ""
          )}
        </p>
      </div>
      {(!!user.currentCity || !!user.currentProvince) && (
        <div>
          <p className="font-bold">
            {intl.formatMessage({
              defaultMessage: "Current Location:",
              id: "DMdCkf",
              description:
                "Display text for the current location field on users",
            })}
          </p>
          <p>
            {user.currentCity ?? ""}
            {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
            {user.currentCity && user.currentProvince?.label ? ", " : ""}
            {getLocalizedName(user.currentProvince?.label, intl, true)}
          </p>
        </div>
      )}
      <div>
        <p className="font-bold">
          {intl.formatMessage({
            defaultMessage: "Member of CAF:",
            id: "EkBES+",
            description: "label for CAF status",
          })}
        </p>
        {user.armedForcesStatus?.label && (
          <p>{getLocalizedName(user.armedForcesStatus.label, intl)}</p>
        )}
      </div>
      <div>
        <p className="font-bold">
          {intl.formatMessage({
            defaultMessage: "Citizenship:",
            id: "LOhcO4",
            description: "label for citizenship status",
          })}
        </p>
        <p>{getLocalizedName(user.citizenship?.label, intl, true)}</p>
      </div>
    </Well>
  );
};

export default AboutSection;
