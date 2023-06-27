import React from "react";
import { useIntl } from "react-intl";

import { User } from "@gc-digital-talent/graphql";
import { empty, notEmpty } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  getOperationalRequirement,
  getWorkRegion,
} from "@gc-digital-talent/i18n";

import { PositionDuration } from "~/api/generated";

import FieldDisplay from "../FieldDisplay";
import DisplayColumn from "../DisplayColumn";
import { useApplicationContext } from "../../../ApplicationContext";

interface DisplayProps {
  user: User;
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
  const { isIAP } = useApplicationContext();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const locations = locationPreferences?.filter(notEmpty);
  const acceptedRequirements =
    acceptedOperationalRequirements?.filter(notEmpty);

  const durationMessage =
    positionDuration && positionDuration.includes(PositionDuration.Temporary)
      ? intl.formatMessage({
          defaultMessage:
            "any duration. (short term, long term, or indeterminate duration)",
          id: "uHx3G7",
          description:
            "Label displayed on Work Preferences form for any duration option",
        })
      : intl.formatMessage({
          defaultMessage: "Permanent duration",
          id: "8cRL8r",
          description: "Permanent duration only",
        });

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
      data-h2-gap="base(x1)"
    >
      <DisplayColumn>
        {!isIAP && (
          <FieldDisplay
            hasError={empty(positionDuration)}
            label={intl.formatMessage({
              defaultMessage: "Job duration",
              id: "/yOfhq",
              description: "Job duration label",
            })}
          >
            {positionDuration ? durationMessage : notProvided}
          </FieldDisplay>
        )}
        <div>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Work details",
              id: "cJtvya",
              description: "Work details label",
            })}
          />
          {acceptedRequirements?.length ? (
            <ul>
              {acceptedRequirements.map((requirement) => (
                <li key={requirement}>
                  {intl.formatMessage(getOperationalRequirement(requirement))}
                </li>
              ))}
            </ul>
          ) : (
            notProvided
          )}
        </div>
      </DisplayColumn>
      <DisplayColumn>
        <div>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Work location(s)",
              id: "inHQQ2",
              description: "Work location(s) label",
            })}
          />
          {locations?.length ? (
            <ul>
              {locations.map((location) => (
                <li key={location}>
                  {intl.formatMessage(getWorkRegion(location))}
                </li>
              ))}
            </ul>
          ) : (
            notProvided
          )}
        </div>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Work location exceptions",
            id: "OpKC2i",
            description: "Work location exceptions label",
          })}
        >
          {locationExemptions || notProvided}
        </FieldDisplay>
      </DisplayColumn>
    </div>
  );
};

export default Display;
