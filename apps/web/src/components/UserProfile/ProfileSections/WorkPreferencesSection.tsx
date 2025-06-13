import { useIntl } from "react-intl";

import { Ul, Well } from "@gc-digital-talent/ui";
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

import { styles } from "./styles";

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
  const { well, label, value } = styles();
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
    <Well className={well()}>
      {positionDuration &&
        positionDuration.includes(PositionDuration.Temporary) && (
          <div>
            <p>{intl.formatMessage(profileMessages.contractDuration)}</p>
            <Ul className="mb-6">
              <li>{intl.formatMessage(profileMessages.anyDuration)}</li>
            </Ul>
          </div>
        )}

      {positionDuration &&
        !positionDuration.includes(PositionDuration.Temporary) && (
          <div>
            <p>{intl.formatMessage(profileMessages.contractDuration)}</p>
            <Ul className="mb-6">
              <li>{intl.formatMessage(profileMessages.anyDuration)}</li>
            </Ul>
          </div>
        )}

      <div>
        <p>{intl.formatMessage(profileMessages.acceptableRequirements)}</p>
        <Ul unStyled space="md">
          {OperationalRequirements.map((requirement) => (
            <li key={requirement}>
              <BoolCheckIcon value={acceptedRequirements.includes(requirement)}>
                {intl.formatMessage(
                  getOperationalRequirement(requirement, "firstPersonNoBold"),
                )}
              </BoolCheckIcon>
            </li>
          ))}
        </Ul>
      </div>
      <p>
        <span className={label()}>
          {intl.formatMessage(profileMessages.currentLocation)}
        </span>
        <span className={value()}>
          {formatLocation({
            city: currentCity,
            region: currentProvince,
            intl,
          })}
        </span>
      </p>
      <p>
        <span className={label()}>
          {intl.formatMessage({
            defaultMessage: "Work location",
            id: "JO2yLA",
            description: "Work Location label, followed by colon",
          })}
        </span>
        <span className={value()}>{regionPreferences}</span>
      </p>
      {!!locationExemptions && (
        <p>
          <span className={label()}>
            {intl.formatMessage({
              defaultMessage: "Work location exceptions",
              id: "OpKC2i",
              description: "Work location exceptions label",
            })}
          </span>
          <span className={value()}>{locationExemptions}</span>
        </p>
      )}

      {hasAllEmptyFields(user) && (
        <p>{intl.formatMessage(commonMessages.noInformationProvided)}</p>
      )}
    </Well>
  );
};

export default WorkPreferencesSection;
