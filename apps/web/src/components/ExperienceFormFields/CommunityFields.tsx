import React from "react";
import { useIntl } from "react-intl";
import { useWatch } from "react-hook-form";

import {
  Checkbox,
  DATE_SEGMENT,
  DateInput,
  Input,
} from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { strToFormDate } from "@gc-digital-talent/date-helpers";

import { SubExperienceFormProps } from "~/types/experience";

const CommunityFields = ({ labels }: SubExperienceFormProps) => {
  const intl = useIntl();
  const todayDate = new Date();
  // to toggle whether endDate is required, the state of the current-role checkbox must be monitored and have to adjust the form accordingly
  const isCurrent = useWatch({ name: "currentRole" });
  // ensuring endDate isn't before startDate, using this as a minimum value
  const startDate = useWatch({ name: "startDate" });

  return (
    <div className="mt-3 max-w-[50rem]">
      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          id="role"
          label={labels.role}
          name="role"
          type="text"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
        <Checkbox
          boundingBox
          boundingBoxLabel={labels.currentRole}
          id="currentRole"
          label={intl.formatMessage({
            defaultMessage: "I am currently active in this role",
            id: "mOx5K1",
            description: "Label displayed for current role input",
          })}
          name="currentRole"
        />
        <Input
          id="organization"
          label={labels.organization}
          name="organization"
          type="text"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
        <Input
          id="project"
          label={labels.project}
          name="project"
          type="text"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
        <DateInput
          id="startDate"
          legend={labels.startDate}
          name="startDate"
          show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
          rules={{
            required: intl.formatMessage(errorMessages.required),
            max: {
              value: strToFormDate(todayDate.toISOString()),
              message: intl.formatMessage(errorMessages.mustNotBeFuture),
            },
          }}
        />
        {/* conditionally render the endDate based off the state attached to the checkbox input */}
        {!isCurrent && (
          <DateInput
            id="endDate"
            legend={labels.endDate}
            name="endDate"
            show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
            rules={
              isCurrent
                ? {}
                : {
                    required: intl.formatMessage(errorMessages.required),
                    min: {
                      value: startDate,
                      message: intl.formatMessage(errorMessages.mustBeGreater, {
                        value: startDate,
                      }),
                    },
                  }
            }
          />
        )}
      </div>
    </div>
  );
};

export default CommunityFields;
