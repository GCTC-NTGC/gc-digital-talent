import { useIntl } from "react-intl";

import {
  LocalizedOperationalRequirement,
  LocalizedProvinceOrTerritory,
  LocalizedWorkRegion,
  Maybe,
  PositionDuration,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getOperationalRequirement,
  getWorkRegionsDetailed,
} from "@gc-digital-talent/i18n";
import { empty, unpackMaybes } from "@gc-digital-talent/helpers";
import { Ul } from "@gc-digital-talent/ui";

import profileMessages from "~/messages/profileMessages";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import { getLabels } from "~/utils/workPreferenceUtils";
import { formatLocation } from "~/utils/userUtils";

import { SnapshotProps } from "../types";

export interface WorkPreferencesSnapshotV1 {
  acceptedOperationalRequirements: Maybe<
    Maybe<LocalizedOperationalRequirement>[]
  >;
  positionDuration: Maybe<Maybe<PositionDuration>[]>;
  locationPreferences: Maybe<Maybe<LocalizedWorkRegion>[]>;
  locationExemptions: Maybe<string>;
  currentCity: Maybe<string>;
  currentProvince: Maybe<LocalizedProvinceOrTerritory>;
}

export type WorkPreferencesV1Props = SnapshotProps<WorkPreferencesSnapshotV1>;

const WorkPreferencesV1 = ({ snapshot }: WorkPreferencesV1Props) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const labels = getLabels(intl);
  const {
    acceptedOperationalRequirements,
    positionDuration,
    locationPreferences,
    locationExemptions,
    currentCity,
    currentProvince,
  } = snapshot;

  const locations = unpackMaybes(locationPreferences);
  const acceptedRequirements = unpackMaybes(acceptedOperationalRequirements);
  const durationMessage = intl.formatMessage(
    positionDuration?.includes(PositionDuration.Temporary)
      ? profileMessages.anyDuration
      : profileMessages.permanentDuration,
  );

  return (
    <div className="grid gap-6">
      <FieldDisplay
        hasError={empty(positionDuration)}
        label={labels.contractDuration}
      >
        {positionDuration ? durationMessage : notProvided}
      </FieldDisplay>
      <div>
        <FieldDisplay label={labels.acceptedOperationalRequirements} />
        {acceptedRequirements?.length ? (
          <Ul>
            {acceptedRequirements.map((requirement) => (
              <li key={requirement.value}>
                {intl.formatMessage(
                  getOperationalRequirement(
                    requirement.value,
                    "firstPersonNoBold",
                  ),
                )}
              </li>
            ))}
          </Ul>
        ) : (
          notProvided
        )}
      </div>
      <FieldDisplay label={labels.currentLocation}>
        {formatLocation({
          city: currentCity,
          region: currentProvince,
          intl,
        })}
      </FieldDisplay>
      <div>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Job locations",
            id: "K+F5H7",
            description: "Job locations label",
          })}
        />
        {locations?.length ? (
          <Ul>
            {locations.map((location) => (
              <li key={location.value}>
                {intl.formatMessage(getWorkRegionsDetailed(location.value))}
              </li>
            ))}
          </Ul>
        ) : (
          notProvided
        )}
      </div>
      <FieldDisplay
        label={intl.formatMessage({
          defaultMessage: "Location exclusions",
          id: "+SoiCw",
          description: "Location specifics label",
        })}
      >
        {locationExemptions ?? notProvided}
      </FieldDisplay>
    </div>
  );
};

export default WorkPreferencesV1;
