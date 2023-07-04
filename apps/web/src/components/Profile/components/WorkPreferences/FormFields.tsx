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
import useDirtyFields from "../../hooks/useDirtyFields";

const FormFields = ({ labels }: FormFieldProps) => {
  const intl = useIntl();
  useDirtyFields("work");

  return (
    <>
      <div data-h2-padding-top="base(x1)">
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
              label: intl.formatMessage({
                defaultMessage:
                  "any duration (short term, long term, indeterminate).",
                id: "YqWNkT",
                description:
                  "Label displayed on Work Preferences form for any duration option",
              }),
            },
            {
              value: "false",
              label: intl.formatMessage({
                defaultMessage: "indeterminate (permanent only).",
                id: "+YUDhx",
                description:
                  "Label displayed on Work Preferences form for indeterminate duration option.",
              }),
            },
          ]}
        />
      </div>
      <div data-h2-padding-top="base(x1)">
        <Checklist
          idPrefix="optional-work-preferences"
          legend={labels.acceptedOperationalRequirements}
          name="acceptedOperationalRequirements"
          id="acceptedOperationalRequirements"
          items={OperationalRequirementV2.map((value) => ({
            value,
            label: intl.formatMessage(
              getOperationalRequirement(value, "firstPerson"),
            ),
          }))}
        />
      </div>
      <div data-h2-padding-top="base(x1)">
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
      </div>
      <div data-h2-padding-top="base(x1)">
        <TextArea
          id="location-exemptions"
          label={labels.locationExemptions}
          name="locationExemptions"
          aria-describedby="location-exemption-description"
        />
      </div>
    </>
  );
};

export default FormFields;
