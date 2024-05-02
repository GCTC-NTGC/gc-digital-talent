import React from "react";
import { useIntl } from "react-intl";

import {
  commonMessages,
  getLanguageRequirement,
  getLocalizedName,
  getSecurityClearance,
  getLocale,
} from "@gc-digital-talent/i18n";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import processMessages from "~/messages/processMessages";

import { DisplayProps } from "../../types";

const Display = ({ pool, subtitle }: DisplayProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const { language, securityClearance, location, isRemote } = pool;

  const hasLocation = !!(isRemote || (location && location[locale]));
  let locationRequirement: string | boolean = false;
  if (isRemote || location) {
    locationRequirement = isRemote
      ? intl.formatMessage({
          defaultMessage: "Remote, hybrid or on-site",
          id: "swESO/",
          description:
            "Location requirement when a pool advertisement is remote",
        })
      : getLocalizedName(location, intl);
  }

  return (
    <>
      {subtitle && <p data-h2-margin-bottom="base(x1)">{subtitle}</p>}
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-grid-template-columns="p-tablet(repeat(2, 1fr)) l-tablet(repeat(3, 1fr))"
      >
        <ToggleForm.FieldDisplay
          hasError={!language}
          label={intl.formatMessage(processMessages.languageRequirement)}
        >
          {language
            ? intl.formatMessage(getLanguageRequirement(language))
            : notProvided}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          hasError={!securityClearance}
          label={intl.formatMessage(processMessages.securityRequirement)}
        >
          {securityClearance
            ? intl.formatMessage(getSecurityClearance(securityClearance))
            : notProvided}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          hasError={!hasLocation}
          label={intl.formatMessage(processMessages.location)}
        >
          {locationRequirement || notProvided}
        </ToggleForm.FieldDisplay>
      </div>
    </>
  );
};

export default Display;
