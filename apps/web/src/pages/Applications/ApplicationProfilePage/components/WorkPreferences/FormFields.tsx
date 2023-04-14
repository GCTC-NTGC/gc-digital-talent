import React from "react";
import { useIntl } from "react-intl";

import {
  Checklist,
  RadioGroup,
  TextArea,
  enumToOptions,
} from "@gc-digital-talent/forms";
import {
  OperationalRequirementV2,
  errorMessages,
  getOperationalRequirement,
  getWorkRegionsDetailed,
} from "@gc-digital-talent/i18n";

import { WorkRegion } from "~/api/generated";

import { FormFieldProps } from "../../types";
import WithEllipsisPrefix from "./WithEllipsisPrefix";

const FormFields = ({ labels }: FormFieldProps) => {
  const intl = useIntl();
  return (
    <>
      <RadioGroup
        idPrefix="required-work-preferences"
        legend={labels.wouldAcceptTemporary}
        name="wouldAcceptTemporary"
        id="wouldAcceptTemporary"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        items={[
          {
            value: "true",
            label: (
              <WithEllipsisPrefix>
                {intl.formatMessage({
                  defaultMessage:
                    "any duration. (short term, long term, or indeterminate duration)",
                  id: "uHx3G7",
                  description:
                    "Label displayed on Work Preferences form for any duration option",
                })}
              </WithEllipsisPrefix>
            ),
          },
          {
            value: "false",
            label: intl.formatMessage({
              defaultMessage:
                "...indeterminate duration only. (permanent only)",
              id: "sYqIp5",
              description:
                "Label displayed on Work Preferences form for indeterminate duration option.",
            }),
          },
        ]}
      />
      <Checklist
        idPrefix="optional-work-preferences"
        legend={labels.acceptedOperationalRequirements}
        name="acceptedOperationalRequirements"
        id="acceptedOperationalRequirements"
        items={OperationalRequirementV2.map((value) => ({
          value,
          label: (
            <WithEllipsisPrefix>
              {intl.formatMessage(
                getOperationalRequirement(value, "firstPerson"),
              )}
            </WithEllipsisPrefix>
          ),
        }))}
      />
      <Checklist
        idPrefix="work-location"
        legend={labels.locationPreferences}
        name="locationPreferences"
        id="locationPreferences"
        items={enumToOptions(WorkRegion).map(({ value }) => ({
          value,
          label: intl.formatMessage(getWorkRegionsDetailed(value)),
        }))}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
      <TextArea
        id="location-exemptions"
        label={labels.locationExemptions}
        name="locationExemptions"
        describedBy="location-exemption-description"
        placeholder={intl.formatMessage({
          defaultMessage: "Optionally, add a city or village here...",
          id: "OH5tTS",
          description:
            "Location Exemptions field placeholder for work location preference form",
        })}
      />
      <div
        id="location-exemption-description"
        data-h2-margin="base(-x.75, 0 , x1, 0)"
      >
        <p data-h2-font-size="base(caption)">
          {intl.formatMessage({
            defaultMessage:
              "Indicate if there is a city that you would like to exclude from a region.",
            id: "1CuGS6",
            description:
              "Explanation text for Location exemptions field in work location preference form",
          })}
        </p>
        <p data-h2-color="base(gray.dark)" data-h2-font-size="base(caption)">
          {intl.formatMessage({
            defaultMessage:
              "E.g.: You want to be considered for the Quebec region, but not for Montréal.",
            id: "2K7dVp",
            description:
              "Example for Location exemptions field in work location preference form",
          })}
        </p>
      </div>
    </>
  );
};

export default FormFields;
