import React from "react";
import { useIntl } from "react-intl";
import { useWatch } from "react-hook-form";

import { Checkbox, Input, TextArea } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";

import { SubExperienceFormProps } from "~/types/experience";

const PersonalFields = ({ labels }: SubExperienceFormProps) => {
  const intl = useIntl();
  const todayDate = Date();
  // to toggle whether End Date is required, the state of the Current Role checkbox must be monitored and have to adjust the form accordingly
  const isCurrent = useWatch({ name: "currentRole" });
  // ensuring end date isn't before the start date, using this as a minimum value
  const watchStartDate = useWatch({ name: "startDate" });

  return (
    <>
      <Input
        id="experienceTitle"
        label={labels.experienceTitle}
        placeholder={intl.formatMessage({
          defaultMessage: "Write title here...",
          id: "Q18B0y",
          description: "Placeholder for experience title input",
        })}
        name="experienceTitle"
        type="text"
        rules={{ required: intl.formatMessage(errorMessages.required) }}
      />
      <TextArea
        id="experienceDescription"
        label={labels.experienceDescription}
        placeholder={intl.formatMessage({
          defaultMessage: "Describe experience details here...",
          id: "Os+BwT",
          description: "Placeholder for experience description input",
        })}
        name="experienceDescription"
        rules={{ required: intl.formatMessage(errorMessages.required) }}
      />
      <div data-h2-margin="base(0, 0, x1, 0)">
        <Checkbox
          boundingBox
          boundingBoxLabel={labels.disclaimer}
          id="disclaimer"
          label={intl.formatMessage({
            defaultMessage:
              "I agree to share this information with verified Government of Canada hiring managers and HR advisors who have access to this platform.",
            id: "oURESC",
            description:
              "Label displayed on Personal Experience form for disclaimer checkbox",
          })}
          name="disclaimer"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
      </div>
      <Checkbox
        boundingBox
        boundingBoxLabel={labels.currentRole}
        id="currentRole"
        label={intl.formatMessage({
          defaultMessage: "I am currently active in this experience",
          id: "aemElP",
          description:
            "Label displayed on Personal Experience form for current experience input",
        })}
        name="currentRole"
      />
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) p-tablet(row)"
      >
        <div data-h2-padding="base(0) p-tablet(0, x2, 0, 0)">
          <Input
            id="startDate"
            label={labels.startDate}
            name="startDate"
            type="date"
            rules={{
              required: intl.formatMessage(errorMessages.required),
              max: {
                value: todayDate,
                message: intl.formatMessage(errorMessages.mustNotBeFuture),
              },
            }}
          />
        </div>
        <div>
          {!isCurrent && (
            <Input
              id="endDate"
              label={labels.endDate}
              name="endDate"
              type="date"
              rules={
                isCurrent
                  ? {}
                  : {
                      required: intl.formatMessage(errorMessages.required),
                      min: {
                        value: watchStartDate,
                        message: intl.formatMessage(
                          errorMessages.dateMustFollow,
                          { value: watchStartDate },
                        ),
                      },
                    }
              }
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PersonalFields;
