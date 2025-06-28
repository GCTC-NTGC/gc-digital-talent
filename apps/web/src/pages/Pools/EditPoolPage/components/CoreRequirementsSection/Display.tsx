import { useIntl } from "react-intl";
import { tv } from "tailwind-variants";

import {
  commonMessages,
  getLocale,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { EditPoolCoreRequirementsFragment } from "@gc-digital-talent/graphql";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import processMessages from "~/messages/processMessages";

import { DisplayProps } from "../../types";

const grid = tv({
  base: "grid gap-6 xs:grid-cols-2",
  variants: {
    four: {
      true: "sm:grid-cols-4",
      false: "sm:grid-cols-3",
    },
  },
});

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
      {subtitle && <p className="mb-6">{subtitle}</p>}
      <div className={grid({ four: !!location?.[locale] })}>
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
