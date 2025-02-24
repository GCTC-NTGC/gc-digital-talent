import { useIntl } from "react-intl";

import { Link, Well } from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";

import { getFullNameHtml } from "~/utils/nameUtils";

import { BasicUserInformationProps } from "../types";

const AboutSection = ({ user }: BasicUserInformationProps) => {
  const intl = useIntl();

  return (
    <Well>
      <div data-h2-flex-grid="base(normal, x1, x.5)">
        <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
          <p data-h2-font-weight="base(700)">
            {intl.formatMessage(commonMessages.name)}
            {intl.formatMessage(commonMessages.dividingColon)}
          </p>
          <p>{getFullNameHtml(user.firstName, user.lastName, intl)}</p>
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
          <p data-h2-font-weight="base(700)">
            {intl.formatMessage(commonMessages.email)}
            {intl.formatMessage(commonMessages.dividingColon)}
          </p>
          <p data-h2-overflow-wrap="base(anywhere)">{user.email}</p>
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
          <p data-h2-font-weight="base(700)">
            {intl.formatMessage(commonMessages.preferredCommunicationLanguage)}
            {intl.formatMessage(commonMessages.dividingColon)}
          </p>
          <p>{getLocalizedName(user.preferredLang?.label, intl)}</p>
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
          <p data-h2-font-weight="base(700)">
            {intl.formatMessage({
              defaultMessage: "Preferred spoken interview language",
              id: "DB9pFd",
              description: "Title for preferred spoken interview language",
            })}
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
        <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
          <p data-h2-font-weight="base(700)">
            {intl.formatMessage({
              defaultMessage: "Preferred written exam language",
              id: "fg2wla",
              description: "Title for preferred written exam language",
            })}
            {intl.formatMessage(commonMessages.dividingColon)}
          </p>
          <p>
            {getLocalizedName(user.preferredLanguageForExam?.label, intl, true)}
          </p>
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
          <p data-h2-font-weight="base(700)">
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
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p data-h2-font-weight="base(700)">
              {intl.formatMessage({
                defaultMessage: "Current Location:",
                id: "DMdCkf",
                description:
                  "Display text for the current location field on users",
              })}
            </p>
            <p>
              {user.currentCity ? user.currentCity : ""}
              {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
              {user.currentCity && user.currentProvince?.label ? ", " : ""}
              {getLocalizedName(user.currentProvince?.label, intl, true)}
            </p>
          </div>
        )}
        <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
          <p data-h2-font-weight="base(700)">
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
        <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
          <p data-h2-font-weight="base(700)">
            {intl.formatMessage({
              defaultMessage: "Citizenship:",
              id: "LOhcO4",
              description: "label for citizenship status",
            })}
          </p>
          <p>{getLocalizedName(user.citizenship?.label, intl, true)}</p>
        </div>
      </div>
    </Well>
  );
};

export default AboutSection;
