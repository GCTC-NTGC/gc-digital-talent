import { useIntl } from "react-intl";

import { empty, notEmpty } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  getOperationalRequirement,
  getWorkRegionsDetailed,
} from "@gc-digital-talent/i18n";
import { PositionDuration } from "@gc-digital-talent/graphql";

import FieldDisplay from "../FieldDisplay";
import { PartialUser } from "./types";

interface DisplayProps {
  user: PartialUser;
}

const Display = ({
  user: {
    acceptedOperationalRequirements,
    positionDuration,
    locationPreferences,
    locationExemptions,
  },
}: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const locations = locationPreferences?.filter(notEmpty);
  const acceptedRequirements =
    acceptedOperationalRequirements?.filter(notEmpty);

  const durationMessage =
    positionDuration && positionDuration.includes(PositionDuration.Temporary)
      ? intl.formatMessage({
          defaultMessage:
            "any duration (short term, long term, indeterminate).",
          id: "YqWNkT",
          description:
            "Label displayed on Work Preferences form for any duration option",
        })
      : intl.formatMessage({
          defaultMessage: "indeterminate (permanent only).",
          id: "+YUDhx",
          description:
            "Label displayed on Work Preferences form for indeterminate duration option.",
        });

  return (
    <div className="grid gap-6">
      <FieldDisplay
        hasError={empty(positionDuration)}
        label={intl.formatMessage({
          defaultMessage: "Job duration",
          id: "/yOfhq",
          description: "Job duration label",
        })}
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
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Job contexts",
            id: "4pJgUJ",
            description: "Work details label",
          })}
        />
        {acceptedRequirements?.length ? (
          <ul>
            {acceptedRequirements.map((requirement) => (
              <li key={requirement}>
                {`${intl.formatMessage({
                  defaultMessage: "I would accept a job that",
                  id: "sTzKQs",
                  description:
                    "Start of sentence describing a users accepted working condition",
                })} ${intl.formatMessage(
                  getOperationalRequirement(requirement, "firstPersonNoBold"),
                )}`}
              </li>
            ))}
          </ul>
        ) : (
          notProvided
        )}
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
          <ul>
            {locations.map((location) => (
              <li key={location}>
                {`${intl.formatMessage({
                  defaultMessage: "I am willing to work in the",
                  id: "cS73MC",
                  description:
                    "Start of sentence describing a users accepted work regions",
                })} ${intl.formatMessage(
                  getWorkRegionsDetailed(location, false),
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
