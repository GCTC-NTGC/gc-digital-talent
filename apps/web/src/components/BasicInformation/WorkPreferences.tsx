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
import { NoList } from "@gc-digital-talent/ui";

import profileMessages from "~/messages/profileMessages";
import { formatLocation } from "~/utils/userUtils";

import FieldDisplay from "../FieldDisplay/FieldDisplay";

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
        en
        fr
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
                    defaultMessage: "Short term, long term, or indeterminate",
                    id: "deKE7f",
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
        {acceptedRequirements?.length ? (
          <NoList>
            {acceptedRequirements.map((requirement) => {
              const label =
                operationalRequirements.find(
                  (or) => String(or.value) === requirement,
                )?.label.localized ?? requirement;
              return <li key={requirement}>{label}</li>;
            })}
          </NoList>
        ) : (
          notProvided
        )}
      </FieldDisplay>
      <FieldDisplay label={intl.formatMessage(profileMessages.currentLocation)}>
        {formatLocation({ city: currentCity, region: currentProvince, intl })}
      </FieldDisplay>
      <FieldDisplay
        label={intl.formatMessage(profileMessages.workLocationPreferences)}
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
