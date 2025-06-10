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
import { Ul } from "@gc-digital-talent/ui";

import profileMessages from "~/messages/profileMessages";
import { formatLocation } from "~/utils/userUtils";

import FieldDisplay from "../FieldDisplay/FieldDisplay";
import Caption from "./Caption";

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
    <div className="grid gap-6 xs:grid-cols-1">
      <FieldDisplay
        label={intl.formatMessage(profileMessages.contractDuration)}
      >
        {positionDuration ? (
          <div className="flex flex-col">
            {positionDuration?.includes(PositionDuration.Temporary) ? (
              <>
                <span>
                  {intl.formatMessage({
                    defaultMessage: "Any duration",
                    id: "w2luTd",
                    description: "Message for position duration field display",
                  })}
                </span>
                <Caption>
                  {intl.formatMessage({
                    defaultMessage: "Short term, long term, or indeterminate",
                    id: "deKE7f",
                    description:
                      "Description for position duration field display",
                  })}
                </Caption>
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
                <Caption>
                  {intl.formatMessage({
                    defaultMessage: "Permanent only",
                    id: "3bdGj/",
                    description:
                      "Description for position duration field display",
                  })}
                </Caption>
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
          <Ul>
            {acceptedRequirements.map((requirement) => {
              const label =
                operationalRequirements.find(
                  (or) => String(or.value) === requirement,
                )?.label.localized ?? requirement;
              return <li key={requirement}>{label}</li>;
            })}
          </Ul>
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
          <Ul>
            {locations.map((location) => (
              <li key={location.value}>{location?.label.localized}</li>
            ))}
          </Ul>
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
