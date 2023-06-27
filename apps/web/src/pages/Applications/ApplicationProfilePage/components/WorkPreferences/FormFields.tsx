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

import { useFormContext } from "react-hook-form";
import { FormFieldProps } from "../../types";
import WithEllipsisPrefix from "./WithEllipsisPrefix";
import useDirtyFields from "../../hooks/useDirtyFields";
import { useApplicationContext } from "../../../ApplicationContext";

const FormFields = ({ labels }: FormFieldProps) => {
  const intl = useIntl();
  const { isIAP } = useApplicationContext();
  const { register } = useFormContext();
  useDirtyFields("work");

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x1 0)"
    >
      {isIAP ? (
        <input
          {...register("wouldAcceptTemporary")}
          type="hidden"
          value="true"
        />
      ) : (
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
      )}
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
        aria-describedby="location-exemption-description"
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
    </div>
  );
};

export default FormFields;
