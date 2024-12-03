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
  // to toggle whether End date is required, the state of the Current role checkbox must be monitored and have to adjust the form accordingly
  const isCurrent = useWatch<{ currentRole: string }>({ name: "currentRole" });
  // ensuring end date isn't before the start date, using this as a minimum value
  const startDate = useWatch<{ startDate: string }>({ name: "startDate" });

  return (
    <div data-h2-margin="base(x.5, 0, 0, 0)" data-h2-max-width="base(50rem)">
      <div data-h2-flex-grid="base(flex-start, x2, x1)">
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <Input
            id="role"
            label={labels.role}
            name="role"
            type="text"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
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
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <Input
            id="organization"
            label={labels.organization}
            name="organization"
            type="text"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <Input id="team" label={labels.team} name="team" type="text" />
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
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
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
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
    </div>
  );
};

export default WorkFields;
