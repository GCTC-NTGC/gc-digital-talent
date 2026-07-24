import { useIntl } from "react-intl";
import { useQuery } from "urql";

import type {
  LocalizedFlexibleWorkLocation,
  LocalizedOperationalRequirement,
  LocalizedProvinceOrTerritory,
  LocalizedWorkRegion,
} from "@gc-digital-talent/graphql";
import { graphql, PositionDuration } from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getOperationalRequirement,
  getWorkRegionsDetailed,
  narrowEnumType,
} from "@gc-digital-talent/i18n";
import { empty, unpackMaybes } from "@gc-digital-talent/helpers";
import { Ul } from "@gc-digital-talent/ui";

import profileMessages from "~/messages/profileMessages";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import { getLabels } from "~/utils/workPreferenceUtils";
import { formatLocation } from "~/utils/userUtils";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";

import type { SnapshotProps } from "../types";

const WorkPreferencesSnapshotOptions_Query = graphql(/** GraphQL */ `
  query WorkPreferencesSnapshotOptions {
    flexibleWorkLocations: localizedEnumOptions(
      enumName: "FlexibleWorkLocation"
    ) {
      ... on LocalizedFlexibleWorkLocation {
        value
        label {
          localized
        }
      }
    }
  }
`);

export interface WorkPreferencesSnapshotV1 {
  acceptedOperationalRequirements:
    (LocalizedOperationalRequirement | null | undefined)[] | null;
  positionDuration: (PositionDuration | null | undefined)[] | null;
  locationPreferences: (LocalizedWorkRegion | null | undefined)[] | null;
  locationExemptions: string | null;
  currentCity: string | null;
  currentProvince: LocalizedProvinceOrTerritory | null;
  flexibleWorkLocations:
    (LocalizedFlexibleWorkLocation | null | undefined)[] | null;
}

type WorkPreferencesV1Props = SnapshotProps<WorkPreferencesSnapshotV1>;

const WorkPreferencesV1 = ({ snapshot }: WorkPreferencesV1Props) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const labels = getLabels(intl);
  const [{ data }] = useQuery({
    query: WorkPreferencesSnapshotOptions_Query,
  });
  const {
    acceptedOperationalRequirements,
    positionDuration,
    locationPreferences,
    locationExemptions,
    currentCity,
    currentProvince,
    flexibleWorkLocations,
  } = snapshot;

  const locations = unpackMaybes(locationPreferences);
  const acceptedRequirements = unpackMaybes(acceptedOperationalRequirements);
  const durationMessage = intl.formatMessage(
    positionDuration?.includes(PositionDuration.Temporary)
      ? profileMessages.anyDuration
      : profileMessages.permanentDuration,
  );
  const userLocations = unpackMaybes(flexibleWorkLocations).map(
    (loc) => loc.value,
  );
  const locationOptions = narrowEnumType(
    unpackMaybes(data?.flexibleWorkLocations),
    "FlexibleWorkLocation",
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
          label={intl.formatMessage(
            profileMessages.flexibleWorkLocationOptions,
          )}
        />
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
