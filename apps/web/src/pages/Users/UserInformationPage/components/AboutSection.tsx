import React from "react";
import { useIntl } from "react-intl";

import { Link, Well } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getArmedForcesStatusesAdmin,
  getCitizenshipStatusesAdmin,
  getLanguage,
  getProvinceOrTerritory,
} from "@gc-digital-talent/i18n";

import { getFullNameHtml } from "~/utils/nameUtils";

import { BasicUserInformationProps } from "../types";

const AboutSection = ({ user }: BasicUserInformationProps) => {
  const intl = useIntl();

  return (
    <Well>
      <div data-h2-flex-grid="base(normal, x1, x.5)">
        <div>
          <p className="font-bold">
            {intl.formatMessage({
              defaultMessage: "Name:",
              id: "nok2sR",
              description: "Display text for the name field on users",
            })}
          </p>
          <p>{getFullNameHtml(user.firstName, user.lastName, intl)}</p>
        </div>
        <div>
          <p className="font-bold">
            {intl.formatMessage({
              defaultMessage: "Email:",
              id: "3UkIDo",
              description: "Display text for the email field on users",
            })}
          </p>
          <p>{user.email}</p>
        </div>
        <div>
          <p className="font-bold">
            {intl.formatMessage({
              defaultMessage: "Preferred Communication Language:",
              id: "LvHCvn",
              description:
                "Display text for the preferred communication language field on users",
            })}
          </p>
          <p>
            {user.preferredLang
              ? intl.formatMessage(getLanguage(user.preferredLang as string))
              : ""}
          </p>
        </div>
        <div>
          <p className="font-bold">
            {intl.formatMessage({
              defaultMessage: "Preferred spoken interview language",
              id: "DB9pFd",
              description: "Title for preferred spoken interview language",
            })}
            {intl.formatMessage(commonMessages.dividingColon)}
          </p>
          <p>
            {user.preferredLanguageForInterview
              ? intl.formatMessage(
                  getLanguage(user.preferredLanguageForInterview as string),
                )
              : ""}
          </p>
        </div>
        <div>
          <p className="font-bold">
            {intl.formatMessage({
              defaultMessage: "Preferred written exam language",
              id: "fg2wla",
              description: "Title for preferred written exam language",
            })}
            {intl.formatMessage(commonMessages.dividingColon)}
          </p>
          <p>
            {user.preferredLanguageForExam
              ? intl.formatMessage(
                  getLanguage(user.preferredLanguageForExam as string),
                )
              : ""}
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
            {user.currentCity},{" "}
            {user.currentProvince
              ? intl.formatMessage(
                  getProvinceOrTerritory(user.currentProvince as string),
                )
              : ""}
          </p>
        </div>
        <div>
          <p className="font-bold">
            {intl.formatMessage({
              defaultMessage: "Member of CAF:",
              id: "EkBES+",
              description: "label for CAF status",
            })}
          </p>
          {user.armedForcesStatus !== null &&
            user.armedForcesStatus !== undefined && (
              <p>
                {intl.formatMessage(
                  getArmedForcesStatusesAdmin(user.armedForcesStatus),
                )}
              </p>
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
          <p>
            {user.citizenship
              ? intl.formatMessage(
                  getCitizenshipStatusesAdmin(user.citizenship),
                )
              : ""}
          </p>
        </div>
      </div>
    </Well>
  );
};

export default AboutSection;
