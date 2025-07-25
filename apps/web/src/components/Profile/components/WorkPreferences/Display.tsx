import { useIntl } from "react-intl";

import { empty, notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  getOperationalRequirement,
} from "@gc-digital-talent/i18n";
import {
  FragmentType,
  getFragment,
  graphql,
  PositionDuration,
} from "@gc-digital-talent/graphql";
import { FieldLabels } from "@gc-digital-talent/forms";
import { Ul } from "@gc-digital-talent/ui";

import profileMessages from "~/messages/profileMessages";
import { formatLocation } from "~/utils/userUtils";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";

import { PartialUser } from "./types";

export const FlexibleWorkLocationOptions_Fragment = graphql(/* GraphQL */ `
  fragment FlexibleWorkLocationOptionsFragment on Query {
    flexibleWorkLocation: localizedEnumStrings(
      enumName: "FlexibleWorkLocation"
    ) {
      value
      label {
        en
        fr
        localized
      }
    }
  }
`);

interface DisplayProps {
  user: PartialUser;
  labels: FieldLabels;
  optionsQuery:
    | FragmentType<typeof FlexibleWorkLocationOptions_Fragment>
    | undefined;
}

const Display = ({
  labels,
  user: {
    acceptedOperationalRequirements,
    positionDuration,
    flexibleWorkLocations,
    locationExemptions,
    currentCity,
    currentProvince,
  },
  optionsQuery,
}: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const userLocations: string[] = unpackMaybes(flexibleWorkLocations).map(
    (loc) => loc.value as string,
  );
  const acceptedRequirements =
    acceptedOperationalRequirements?.filter(notEmpty);

  const durationMessage = intl.formatMessage(
    positionDuration?.includes(PositionDuration.Temporary)
      ? profileMessages.anyDuration
      : profileMessages.permanentDuration,
  );

  const locationOptions = unpackMaybes(
    getFragment(FlexibleWorkLocationOptions_Fragment, optionsQuery)
      ?.flexibleWorkLocation,
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
        {formatLocation({ city: currentCity, region: currentProvince, intl })}
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
