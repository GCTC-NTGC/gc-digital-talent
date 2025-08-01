import { useIntl } from "react-intl";

import { Ul, Well } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getLocalizedName,
  getOperationalRequirement,
  OperationalRequirements,
} from "@gc-digital-talent/i18n";
import {
  User,
  PositionDuration,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";
import { insertBetween, unpackMaybes } from "@gc-digital-talent/helpers";

import { hasAllEmptyFields } from "~/validators/profile/workPreferences";
import profileMessages from "~/messages/profileMessages";
import { formatLocation } from "~/utils/userUtils";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";
import { FlexibleWorkLocationOptions_Fragment } from "~/components/Profile/components/WorkPreferences/Display";

import { styles } from "./styles";

interface WorkPreferencesSectionProps {
  user: Pick<
    User,
    | "acceptedOperationalRequirements"
    | "positionDuration"
    | "locationPreferences"
    | "flexibleWorkLocations"
    | "locationExemptions"
    | "currentCity"
    | "currentProvince"
  >;
  optionsQuery:
    | FragmentType<typeof FlexibleWorkLocationOptions_Fragment>
    | undefined;
}

const WorkPreferencesSection = ({
  user,
  optionsQuery,
}: WorkPreferencesSectionProps) => {
  const intl = useIntl();
  const {
    acceptedOperationalRequirements,
    positionDuration,
    currentCity,
    currentProvince,
    locationPreferences,
    flexibleWorkLocations,
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

  const locationOptions = unpackMaybes(
    getFragment(FlexibleWorkLocationOptions_Fragment, optionsQuery)
      ?.flexibleWorkLocation,
  );
  const userLocations: string[] = unpackMaybes(flexibleWorkLocations).map(
    (loc) => loc.value as string,
  );

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
      <div>
        <p>
          <span className={label()}>
            {intl.formatMessage(profileMessages.flexibleWorkLocationOptions)}
          </span>
        </p>
        <Ul unStyled noIndent inside>
          {locationOptions.map((location) => (
            <li key={location.value}>
              <BoolCheckIcon
                value={userLocations.includes(location.value)}
                trueLabel={intl.formatMessage(commonMessages.interested)}
                falseLabel={intl.formatMessage(commonMessages.notInterested)}
              >
                {location.label.localized}
              </BoolCheckIcon>
            </li>
          ))}
        </Ul>
      </div>
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
