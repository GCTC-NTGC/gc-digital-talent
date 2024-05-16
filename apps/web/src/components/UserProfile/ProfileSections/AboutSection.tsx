import { useIntl } from "react-intl";

import { Link, Well } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getProvinceOrTerritory,
  getCitizenshipStatusesProfile,
  getArmedForcesStatusesProfile,
  getLanguage,
} from "@gc-digital-talent/i18n";
import type { User } from "@gc-digital-talent/graphql";

import { getFullNameHtml } from "~/utils/nameUtils";
import { hasEmptyRequiredFields } from "~/validators/profile/about";

interface AboutSectionProps {
  user: User;
  editPath?: string;
}

const AboutSection = ({ editPath, user }: AboutSectionProps) => {
  const intl = useIntl();
  const {
    firstName,
    lastName,
    telephone,
    email,
    preferredLang,
    preferredLanguageForInterview,
    preferredLanguageForExam,
    currentCity,
    currentProvince,
    citizenship,
    armedForcesStatus,
  } = user;
  return (
    <Well>
      <div data-h2-flex-grid="base(flex-start, x2, x1)">
        {(!!firstName || !!lastName) && (
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p>
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Name:",
                  id: "DAmLhV",
                  description: "Name label and colon",
                })}
              </span>
              <span data-h2-font-weight="base(700)">
                {getFullNameHtml(firstName, lastName, intl)}
              </span>
            </p>
          </div>
        )}
        {!!email && (
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p>
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Email:",
                  id: "mtFK6A",
                  description: "Email label and colon",
                })}
              </span>
              <span data-h2-font-weight="base(700)">{email}</span>
            </p>
          </div>
        )}
        {!!telephone && (
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p>
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Phone:",
                  id: "azOv8A",
                  description: "Phone label and colon",
                })}
              </span>
              {telephone ? (
                <Link
                  external
                  color="black"
                  href={`tel:${telephone}`}
                  aria-label={telephone.replace(/.{1}/g, "$& ")}
                >
                  <span data-h2-font-weight="base(700)">{telephone}</span>
                </Link>
              ) : (
                ""
              )}
            </p>
          </div>
        )}
        {!!preferredLang && (
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p>
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Preferred Communication Language:",
                  id: "bEwwY/",
                  description:
                    "Preferred Language for communication purposes label and colon",
                })}
              </span>
              <span data-h2-font-weight="base(700)">
                {preferredLang
                  ? intl.formatMessage(getLanguage(preferredLang))
                  : ""}
              </span>
            </p>
          </div>
        )}

        {!!preferredLanguageForInterview && (
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p>
              {intl.formatMessage({
                defaultMessage: "Preferred spoken interview language",
                id: "DB9pFd",
                description: "Title for preferred spoken interview language",
              })}
              {intl.formatMessage(commonMessages.dividingColon)}
              <br />
              <span data-h2-font-weight="base(700)">
                {preferredLanguageForInterview
                  ? intl.formatMessage(
                      getLanguage(preferredLanguageForInterview),
                    )
                  : ""}
              </span>
            </p>
          </div>
        )}

        {!!preferredLanguageForExam && (
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p>
              {intl.formatMessage({
                defaultMessage: "Preferred written exam language",
                id: "fg2wla",
                description: "Title for preferred written exam language",
              })}
              {intl.formatMessage(commonMessages.dividingColon)}
              <br />
              <span data-h2-font-weight="base(700)">
                {preferredLanguageForExam
                  ? intl.formatMessage(getLanguage(preferredLanguageForExam))
                  : ""}
              </span>
            </p>
          </div>
        )}

        {!!currentCity && !!currentProvince && (
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p>
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Current Location:",
                  id: "s1h7Mc",
                  description: "Current Location label and colon",
                })}
              </span>
              <span data-h2-font-weight="base(700)">
                {currentCity},{" "}
                {currentProvince
                  ? intl.formatMessage(getProvinceOrTerritory(currentProvince))
                  : ""}
              </span>
            </p>
          </div>
        )}
        {armedForcesStatus !== null && armedForcesStatus !== undefined && (
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p>
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Member of CAF:",
                  id: "Md/cQS",
                  description: "Veteran/member label",
                })}
              </span>
              <span data-h2-font-weight="base(700)">
                {intl.formatMessage(
                  getArmedForcesStatusesProfile(armedForcesStatus),
                )}
              </span>
            </p>
          </div>
        )}
        {citizenship ? (
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
            <p>
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Citizenship Status:",
                  id: "92hwzj",
                  description: "Citizenship status label",
                })}
              </span>
              <span data-h2-font-weight="base(700)">
                {intl.formatMessage(getCitizenshipStatusesProfile(citizenship))}
              </span>
            </p>
          </div>
        ) : (
          ""
        )}
      </div>
      {hasEmptyRequiredFields(user) && (
        <div data-h2-margin="base(x1, 0, 0, 0)">
          <p>
            {editPath && (
              <>
                {intl.formatMessage(commonMessages.requiredFieldsMissing)}{" "}
                <Link href={editPath}>
                  {intl.formatMessage({
                    defaultMessage: "Edit your about me options.",
                    id: "L9AGk7",
                    description:
                      "Link text to edit about me section on profile.",
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

export default AboutSection;
