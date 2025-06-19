import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useFormContext, useWatch } from "react-hook-form";

import {
  Checkbox,
  DATE_SEGMENT,
  DateInput,
  Input,
  TextArea,
} from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { strToFormDate } from "@gc-digital-talent/date-helpers";

import { PersonalFormValues, SubExperienceFormProps } from "~/types/experience";

const PersonalFields = ({ labels }: SubExperienceFormProps) => {
  const intl = useIntl();
  const todayDate = new Date();
  const {
    setValue,
    formState: { defaultValues },
  } = useFormContext<PersonalFormValues>();
  // to toggle whether End date is required, the state of the Current role checkbox must be monitored and have to adjust the form accordingly
  const isCurrent = useWatch<PersonalFormValues>({ name: "currentRole" });
  // ensuring end date isn't before the start date, using this as a minimum value
  const watchStartDate = useWatch<PersonalFormValues>({ name: "startDate" });
  const watchDescription = useWatch<PersonalFormValues>({
    name: "experienceDescription",
  });

  useEffect(() => {
    if (watchDescription !== defaultValues?.experienceDescription) {
      setValue("disclaimer", false);
    }
  }, [defaultValues?.experienceDescription, setValue, watchDescription]);

  return (
    <div className="mt-6 flex flex-col gap-y-6">
      <Input
        id="experienceTitle"
        label={labels.experienceTitle}
        name="experienceTitle"
        type="text"
        rules={{ required: intl.formatMessage(errorMessages.required) }}
      />
      <TextArea
        id="experienceDescription"
        label={labels.experienceDescription}
        name="experienceDescription"
        rules={{ required: intl.formatMessage(errorMessages.required) }}
      />
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
      <div className="grid gap-6 xs:grid-cols-2">
        <DateInput
          id="startDate"
          legend={labels.startDate}
          name="startDate"
          round="floor"
          show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
          rules={{
            required: intl.formatMessage(errorMessages.required),
            max: {
              value: strToFormDate(todayDate.toISOString()),
              message: intl.formatMessage(errorMessages.mustNotBeFuture),
            },
          }}
        />
        <div>
          {!isCurrent && (
            <DateInput
              id="endDate"
              legend={labels.endDate}
              name="endDate"
              round="ceil"
              show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
              rules={
                isCurrent
                  ? {}
                  : {
                      required: intl.formatMessage(errorMessages.required),
                      min: {
                        value: String(watchStartDate),
                        message: String(
                          intl.formatMessage(errorMessages.dateMustFollow, {
                            value: watchStartDate,
                          }),
                        ),
                      },
                    }
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalFields;
