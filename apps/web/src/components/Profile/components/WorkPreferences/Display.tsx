import { useIntl } from "react-intl";

import { empty, notEmpty } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  getOperationalRequirement,
  getWorkRegionsDetailed,
} from "@gc-digital-talent/i18n";
import { PositionDuration } from "@gc-digital-talent/graphql";
import { FieldLabels } from "@gc-digital-talent/forms";

import FieldDisplay from "../FieldDisplay";
import { PartialUser } from "./types";
import { formatLocation } from "./utils";

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

  const durationMessage = positionDuration?.includes(PositionDuration.Temporary)
    ? intl.formatMessage({
        defaultMessage: "Any duration (short term, long term, indeterminate)",
        id: "ohQoWa",
        description:
          "Label displayed on Work Preferences form for any duration option",
      })
    : intl.formatMessage({
        defaultMessage: "Indeterminate (permanent only)",
        id: 'aB5p3B',
        description:
          "Label displayed on Work Preferences form for indeterminate duration option.",
      });

  return (
    <div data-h2-display="base(grid)" data-h2-gap="base(x1)">
      <FieldDisplay
        hasError={empty(positionDuration)}
        label={labels.contractDuration}
      >
        {positionDuration
          ? `${intl.formatMessage({
              defaultMessage: "I would accept a job that lasts for",
              id: "ghg7uN",
              description:
                "Start of sentence describing a users accepted working term",
            })} ${durationMessage}`
          : notProvided}
      </FieldDisplay>
      <div>
        <FieldDisplay label={labels.acceptedOperationalRequirements} />
        {acceptedRequirements?.length ? (
          <ul>
            {acceptedRequirements.map((requirement) => (
              <li key={requirement.value}>
                {`${intl.formatMessage({
                  defaultMessage: "I would accept a job that",
                  id: "sTzKQs",
                  description:
                    "Start of sentence describing a users accepted working condition",
                })} ${intl.formatMessage(
                  getOperationalRequirement(
                    requirement.value,
                    "firstPersonNoBold",
                  ),
                )}`}
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
                {`${intl.formatMessage({
                  defaultMessage: "I am willing to work in the",
                  id: "cS73MC",
                  description:
                    "Start of sentence describing a users accepted work regions",
                })} ${intl.formatMessage(
                  getWorkRegionsDetailed(location.value, false),
                )}.`}
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
        {locationExemptions || notProvided}
      </FieldDisplay>
    </div>
  );
};

export default Display;
