import React from "react";
import { useIntl } from "react-intl";

import { User } from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  getOperationalRequirement,
  getWorkRegion,
} from "@gc-digital-talent/i18n";

import { PositionDuration } from "~/api/generated";

import ProfileLabel from "../ProfileLabel";

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
  const locations = locationPreferences?.filter(notEmpty);
  const acceptedRequirements =
    acceptedOperationalRequirements?.filter(notEmpty);

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
      data-h2-gap="base(x1)"
    >
      <p>
        <ProfileLabel>
          {intl.formatMessage({
            defaultMessage: "Job duration:",
            id: "DAmLhV",
            description: "Job duration label and colon",
          })}
        </ProfileLabel>
        <span>
          {positionDuration &&
          positionDuration.includes(PositionDuration.Temporary)
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
              })}
        </span>
      </p>
      <div>
        <p>
          <ProfileLabel>
            {intl.formatMessage({
              defaultMessage: "Work details",
              id: "b5bUa0",
              description: "Work preference details label)",
            })}
          </ProfileLabel>
        </p>
        {acceptedRequirements?.length ? (
          <ul>
            {acceptedRequirements.map((requirement) => (
              <li key={requirement}>
                {intl.formatMessage(getOperationalRequirement(requirement))}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div>
        <p>
          <ProfileLabel>
            {intl.formatMessage({
              defaultMessage: "Work location(s)",
              id: "b5bUa0",
              description: "Work Location(s) label)",
            })}
          </ProfileLabel>
        </p>
        {locations?.length ? (
          <ul>
            {locations.map((location) => (
              <li key={location}>
                {intl.formatMessage(getWorkRegion(location))}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <p>
        <ProfileLabel>
          {intl.formatMessage({
            defaultMessage: "Location exemptions:",
            id: "MoWNS4",
            description: "Location Exemptions label, followed by colon",
          })}
        </ProfileLabel>
        <span>{locationExemptions}</span>
      </p>
    </div>
  );
};

export default Display;
