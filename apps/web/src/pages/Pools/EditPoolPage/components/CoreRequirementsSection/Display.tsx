import { useIntl } from "react-intl";

import {
  commonMessages,
  getLocale,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { EditPoolCoreRequirementsFragment } from "@gc-digital-talent/graphql";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import processMessages from "~/messages/processMessages";

import { DisplayProps } from "../../types";

const Display = ({
  pool,
  subtitle,
}: DisplayProps<EditPoolCoreRequirementsFragment>) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const { language, securityClearance, location, isRemote } = pool;

  const hasLocation = isRemote || (!!location?.en && !!location?.fr);

  return (
    <>
      {subtitle && <p data-h2-margin-bottom="base(x1)">{subtitle}</p>}
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        {...(location?.[locale]
          ? {
              "data-h2-grid-template-columns":
                "p-tablet(repeat(2, 1fr)) l-tablet(repeat(4, 1fr))",
            }
          : {
              "data-h2-grid-template-columns":
                "p-tablet(repeat(2, 1fr)) l-tablet(repeat(3, 1fr))",
            })}
      >
        <ToggleForm.FieldDisplay
          hasError={!language}
          label={intl.formatMessage(processMessages.languageRequirement)}
        >
          {getLocalizedName(language?.label, intl)}
        </ToggleForm.FieldDisplay>
        <ToggleForm.FieldDisplay
          hasError={!securityClearance}
          label={intl.formatMessage(processMessages.securityRequirement)}
        >
          {getLocalizedName(securityClearance?.label, intl)}
        </ToggleForm.FieldDisplay>
        {isRemote ? (
          <ToggleForm.FieldDisplay
            hasError={!hasLocation}
            label={intl.formatMessage(processMessages.location)}
          >
            {intl.formatMessage(commonMessages.remote) || notProvided}
          </ToggleForm.FieldDisplay>
        ) : (
          <>
            <ToggleForm.FieldDisplay
              hasError={!hasLocation}
              label={intl.formatMessage(processMessages.locationEn)}
            >
              {location?.en ?? notProvided}
            </ToggleForm.FieldDisplay>
            <ToggleForm.FieldDisplay
              hasError={!hasLocation}
              label={intl.formatMessage(processMessages.locationFr)}
            >
              {location?.fr ?? notProvided}
            </ToggleForm.FieldDisplay>
          </>
        )}
      </div>
    </>
  );
};

export default Display;
