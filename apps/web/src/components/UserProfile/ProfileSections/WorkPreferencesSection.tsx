import { useIntl } from "react-intl";

import { NoList, Well } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getLocalizedName,
  getOperationalRequirement,
  OperationalRequirements,
} from "@gc-digital-talent/i18n";
import { User, PositionDuration } from "@gc-digital-talent/graphql";
import { insertBetween, unpackMaybes } from "@gc-digital-talent/helpers";

import { hasAllEmptyFields } from "~/validators/profile/workPreferences";
import profileMessages from "~/messages/profileMessages";
import { formatLocation } from "~/utils/userUtils";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";

interface WorkPreferencesSectionProps {
  user: Pick<
    User,
    | "acceptedOperationalRequirements"
    | "positionDuration"
    | "locationPreferences"
    | "locationExemptions"
    | "currentCity"
    | "currentProvince"
  >;
}

const WorkPreferencesSection = ({ user }: WorkPreferencesSectionProps) => {
  const intl = useIntl();
  const {
    acceptedOperationalRequirements,
    positionDuration,
    currentCity,
    currentProvince,
    locationPreferences,
    locationExemptions,
  } = user;
  const acceptedRequirements = unpackMaybes(
    acceptedOperationalRequirements,
  ).map((requirement) => requirement.value);
  const regionPreferencesSquished = locationPreferences?.map((region) =>
    getLocalizedName(region?.label, intl, true),
  );
  const regionPreferences = regionPreferencesSquished
    ? insertBetween(", ", regionPreferencesSquished)
    : "";

  return (
    <Well>
      <div data-h2-flex-grid="base(flex-start, x2, x1)">
        {positionDuration &&
          positionDuration.includes(PositionDuration.Temporary) && (
            <div data-h2-flex-item="base(1of1)">
              <p>{intl.formatMessage(profileMessages.contractDuration)}</p>
              <ul data-h2-padding="base(0, 0, 0, x1)">
                <li>{intl.formatMessage(profileMessages.anyDuration)}</li>
              </ul>
            </div>
          )}

        {positionDuration &&
          !positionDuration.includes(PositionDuration.Temporary) && (
            <div data-h2-flex-item="base(1of1)">
              <p>{intl.formatMessage(profileMessages.contractDuration)}</p>
              <ul data-h2-padding="base(0, 0, 0, x1)">
                <li>{intl.formatMessage(profileMessages.anyDuration)}</li>
              </ul>
            </div>
          )}

        <div data-h2-flex-item="base(1of1)">
          <p>{intl.formatMessage(profileMessages.acceptableRequirements)}</p>
          <NoList>
            {OperationalRequirements.map((requirement) => (
              <li key={requirement} data-h2-margin-bottom="base(x.25)">
                <BoolCheckIcon
                  value={acceptedRequirements.includes(requirement)}
                >
                  {intl.formatMessage(
                    getOperationalRequirement(requirement, "firstPersonNoBold"),
                  )}
                </BoolCheckIcon>
              </li>
            ))}
          </NoList>
        </div>
        <div data-h2-flex-item="base(1of1)">
          <p>
            <span data-h2-display="base(block)">
              {intl.formatMessage(profileMessages.currentLocation)}
            </span>
            <span data-h2-font-weight="base(700)">
              {formatLocation({
                city: currentCity,
                region: currentProvince,
                intl,
              })}
            </span>
          </p>
        </div>
        <div data-h2-flex-item="base(1of1)">
          <p>
            <span data-h2-display="base(block)">
              {intl.formatMessage({
                defaultMessage: "Work location",
                id: "JO2yLA",
                description: "Work Location label, followed by colon",
              })}
            </span>
            <span data-h2-font-weight="base(700)">{regionPreferences}</span>
          </p>
        </div>
        {!!locationExemptions && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Work location exceptions",
                  id: "OpKC2i",
                  description: "Work location exceptions label",
                })}
              </span>
              <span data-h2-font-weight="base(700)">{locationExemptions}</span>
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

export default WorkPreferencesSection;
