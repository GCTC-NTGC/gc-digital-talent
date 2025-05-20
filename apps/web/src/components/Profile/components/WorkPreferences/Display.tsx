import { useIntl } from "react-intl";

import { empty, notEmpty } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  getOperationalRequirement,
  getWorkRegionsDetailed,
} from "@gc-digital-talent/i18n";
import { PositionDuration } from "@gc-digital-talent/graphql";
import { FieldLabels } from "@gc-digital-talent/forms/types";

import profileMessages from "~/messages/profileMessages";
import { formatLocation } from "~/utils/userUtils";

import FieldDisplay from "../FieldDisplay";
import { PartialUser } from "./types";

interface DisplayProps {
  user: PartialUser;
  labels: FieldLabels;
}

const Display = ({
  labels,
  user: {
    acceptedOperationalRequirements,
    positionDuration,
    locationPreferences,
    locationExemptions,
    currentCity,
    currentProvince,
  },
}: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const locations = locationPreferences?.filter(notEmpty);
  const acceptedRequirements =
    acceptedOperationalRequirements?.filter(notEmpty);

  const durationMessage = intl.formatMessage(
    positionDuration?.includes(PositionDuration.Temporary)
      ? profileMessages.anyDuration
      : profileMessages.permanentDuration,
  );

  return (
    <div data-h2-display="base(grid)" data-h2-gap="base(x1)">
      <FieldDisplay
        hasError={empty(positionDuration)}
        label={labels.contractDuration}
      >
        {positionDuration ? durationMessage : notProvided}
      </FieldDisplay>
      <div>
        <FieldDisplay label={labels.acceptedOperationalRequirements} />
        {acceptedRequirements?.length ? (
          <ul>
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
          </ul>
        ) : (
          notProvided
        )}
      </div>
      <FieldDisplay label={labels.currentLocation}>
        {formatLocation({ city: currentCity, region: currentProvince, intl })}
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
          <ul>
            {locations.map((location) => (
              <li key={location.value}>
                {intl.formatMessage(getWorkRegionsDetailed(location.value))}
              </li>
            ))}
          </ul>
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

export default Display;
