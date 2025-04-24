import { useIntl } from "react-intl";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  EmploymentDuration,
  getEmploymentDuration,
} from "@gc-digital-talent/i18n";
import {
  FragmentType,
  getFragment,
  graphql,
  PositionDuration,
} from "@gc-digital-talent/graphql";

import profileMessages from "~/messages/profileMessages";
import { formatLocation } from "~/utils/userUtils";

import FieldDisplay from "../FieldDisplay/FieldDisplay";
import BoolCheckIcon from "../BoolCheckIcon/BoolCheckIcon";

export const WorkPreferences_Fragment = graphql(/* GraphQL */ `
  fragment WorkPreferences on User {
    acceptedOperationalRequirements {
      value
      label {
        localized
      }
    }
    positionDuration
    locationPreferences {
      value
      label {
        localized
      }
    }
    locationExemptions
    currentCity
    currentProvince {
      value
      label {
        localized
      }
    }
  }
`);

export const WorkPreferencesOptions_Fragment = graphql(/* GraphQL */ `
  fragment WorkPreferencesOptions on Query {
    operationalRequirements: localizedEnumStrings(
      enumName: "OperationalRequirement"
    ) {
      value
      label {
        localized
      }
    }
  }
`);

interface WorkPreferencesProps {
  workPreferencesQuery: FragmentType<typeof WorkPreferences_Fragment>;
  workPreferencesOptionsQuery: FragmentType<
    typeof WorkPreferencesOptions_Fragment
  >;
}

const WorkPreferences = ({
  workPreferencesQuery,
  workPreferencesOptionsQuery,
}: WorkPreferencesProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const workPreferences = getFragment(
    WorkPreferences_Fragment,
    workPreferencesQuery,
  );
  const workPreferencesOptions = getFragment(
    WorkPreferencesOptions_Fragment,
    workPreferencesOptionsQuery,
  );

  const {
    acceptedOperationalRequirements,
    positionDuration,
    locationPreferences,
    locationExemptions,
    currentCity,
    currentProvince,
  } = workPreferences;

  const locations = unpackMaybes(locationPreferences);
  const operationalRequirements = unpackMaybes(
    workPreferencesOptions.operationalRequirements,
  );
  const acceptedRequirements = unpackMaybes(
    acceptedOperationalRequirements,
  ).map((operationalRequirement) => String(operationalRequirement.value));

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="p-tablet(1fr)"
      data-h2-gap="base(x1)"
    >
      <FieldDisplay
        label={intl.formatMessage(profileMessages.contractDuration)}
      >
        {positionDuration ? (
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
          >
            {positionDuration?.includes(PositionDuration.Temporary) ? (
              <>
                <span>
                  {intl.formatMessage({
                    defaultMessage: "Any duration",
                    id: "w2luTd",
                    description: "Message for position duration field display",
                  })}
                </span>
                <span
                  data-h2-font-weight="base(400)"
                  data-h2-font-size="base(caption)"
                  data-h2-color="base(black.light)"
                >
                  {intl.formatMessage({
                    defaultMessage: "Short term, long term, indeterminate",
                    id: "8xmrbK",
                    description:
                      "Description for position duration field display",
                  })}
                </span>
              </>
            ) : (
              <>
                <span>
                  {intl.formatMessage(
                    getEmploymentDuration(
                      EmploymentDuration.Indeterminate,
                      "short",
                    ),
                  )}
                </span>{" "}
                <span
                  data-h2-font-weight="base(400)"
                  data-h2-font-size="base(caption)"
                  data-h2-color="base(black.light)"
                >
                  {intl.formatMessage({
                    defaultMessage: "Permanent only",
                    id: "3bdGj/",
                    description:
                      "Description for position duration field display",
                  })}
                </span>
              </>
            )}
          </div>
        ) : (
          notProvided
        )}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(profileMessages.acceptableRequirements)}
      >
        {operationalRequirements?.length ? (
          <ul data-h2-list-style="base(none)" data-h2-padding="base(0)">
            {operationalRequirements.map((requirement) => (
              <li key={requirement.value}>
                <BoolCheckIcon
                  value={acceptedRequirements.includes(requirement.value)}
                  // trueLabel={} Suggestion: "Yes to" (e.g. Shift-work)
                  // falseLabel={} Suggestion: "No to" (e.g. Shift-work)
                >
                  {requirement?.label.localized}
                </BoolCheckIcon>
              </li>
            ))}
          </ul>
        ) : (
          notProvided
        )}
      </FieldDisplay>
      <FieldDisplay label={intl.formatMessage(profileMessages.currentLocation)}>
        {formatLocation({ city: currentCity, region: currentProvince, intl })}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage({
          defaultMessage: "Location options",
          id: "PCeVpT",
          description: "Label for location options field display",
        })}
      >
        {locations?.length ? (
          <ul>
            {locations.map((location) => (
              <li key={location.value}>{location?.label.localized}</li>
            ))}
          </ul>
        ) : (
          notProvided
        )}
      </FieldDisplay>
      {locationExemptions && (
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Location exclusions",
            id: "+SoiCw",
            description: "Location specifics label",
          })}
        >
          {locationExemptions}
        </FieldDisplay>
      )}
    </div>
  );
};

export default WorkPreferences;
