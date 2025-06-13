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

import {
  SubExperienceFormProps,
  CommunityFormValues,
} from "~/types/experience";

const CommunityFields = ({
  labels,
  organizationSuggestions,
}: SubExperienceFormProps & { organizationSuggestions: string[] }) => {
  const intl = useIntl();
  const todayDate = new Date();
  // to toggle whether endDate is required, the state of the current-role checkbox must be monitored and have to adjust the form accordingly
  const isCurrent = useWatch<CommunityFormValues>({ name: "currentRole" });
  // ensuring endDate isn't before startDate, using this as a minimum value
  const startDate = useWatch<CommunityFormValues>({ name: "startDate" });

  return (
    <div className="grid gap-6 xs:grid-cols-2">
      <div>
        <Input
          id="role"
          label={labels.role}
          name="role"
          type="text"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
      </div>
      <div>
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
      <div>
        <Input
          id="organization"
          label={labels.organization}
          name="organization"
          type="text"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          list={
            organizationSuggestions.length
              ? "organizationSuggestions"
              : undefined
          }
        />
        {organizationSuggestions.length > 0 && (
          <datalist id="organizationSuggestions">
            {organizationSuggestions.map((suggestion) => {
              return <option key={suggestion} value={suggestion}></option>;
            })}
          </datalist>
        )}
      </div>
      <div>
        <Input
          id="project"
          label={labels.project}
          name="project"
          type="text"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
      </div>
      <div>
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
      </div>
      <div>
        {/* conditionally render the endDate based off the state attached to the checkbox input */}
        {!isCurrent && (
          <DateInput
            id="endDate"
            legend={labels.endDate}
            name="endDate"
            round="ceil"
            show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
            rules={
              isCurrent && startDate
                ? {}
                : {
                    required: intl.formatMessage(errorMessages.required),
                    min: {
                      value: String(startDate),
                      message: String(
                        intl.formatMessage(errorMessages.mustBeGreater, {
                          value: startDate,
                        }),
                      ),
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
