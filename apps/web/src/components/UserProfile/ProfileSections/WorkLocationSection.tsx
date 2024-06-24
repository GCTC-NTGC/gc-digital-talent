import { useIntl } from "react-intl";

import { Well } from "@gc-digital-talent/ui";
import { commonMessages, getWorkRegion } from "@gc-digital-talent/i18n";
import { insertBetween } from "@gc-digital-talent/helpers";
import { User } from "@gc-digital-talent/graphql";

import {
  anyCriteriaSelected,
  hasAllEmptyFields,
} from "~/validators/profile/workLocation";

const WorkLocationSection = ({ user }: { user: User }) => {
  const intl = useIntl();
  // generate array of location preferences localized and formatted with spaces/commas
  const regionPreferencesSquished = user.locationPreferences?.map((region) =>
    region ? intl.formatMessage(getWorkRegion(region)) : "",
  );
  const regionPreferences = regionPreferencesSquished
    ? insertBetween(", ", regionPreferencesSquished)
    : "";

  return (
    <Well>
      <div data-h2-flex-grid="base(flex-start, x2, x1)">
        {anyCriteriaSelected(user) && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Work location:",
                  id: "b5bUa0",
                  description: "Work Location label, followed by colon",
                })}
              </span>
              <span data-h2-font-weight="base(700)">{regionPreferences}</span>
            </p>
          </div>
        )}
        {!!user.locationExemptions && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Work location exceptions",
                  id: "OpKC2i",
                  description: "Work location exceptions label",
                })}
                {intl.formatMessage(commonMessages.dividingColon)}
              </span>
              <span data-h2-font-weight="base(700)">
                {user.locationExemptions}
              </span>
            </p>
          </div>
        )}
        {hasAllEmptyFields(user) && (
          <div data-h2-flex-item="base(1of1)">
            <p>{intl.formatMessage(commonMessages.noInformationProvided)}</p>
          </div>
        )}
      </div>
    </Well>
  );
};

export default WorkLocationSection;
