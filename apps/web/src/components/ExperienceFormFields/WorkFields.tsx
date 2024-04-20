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

const WorkFields = ({ labels }: SubExperienceFormProps) => {
  const intl = useIntl();
  const todayDate = new Date();
  // to toggle whether End Date is required, the state of the Current Role checkbox must be monitored and have to adjust the form accordingly
  const isCurrent = useWatch({ name: "currentRole" });
  // ensuring end date isn't before the start date, using this as a minimum value
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
        <Input id="team" label={labels.team} name="team" type="text" />
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
        {/* conditionally render the end-date based off the state attached to the checkbox input */}
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
                      message: intl.formatMessage(errorMessages.futureDate),
                    },
                  }
            }
          />
        )}
      </div>
    </div>
  );
};

export default WorkFields;
