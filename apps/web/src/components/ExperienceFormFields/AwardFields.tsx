import React from "react";
import { useIntl } from "react-intl";

import {
  DateInput,
  Input,
  Select,
  enumToOptions,
  DATE_SEGMENT,
} from "@gc-digital-talent/forms";
import {
  errorMessages,
  getAwardedScope,
  getAwardedTo,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { strToFormDate } from "@gc-digital-talent/date-helpers";
import { AwardedScope, AwardedTo } from "@gc-digital-talent/graphql";

import { SubExperienceFormProps } from "~/types/experience";

const AwardFields = ({ labels }: SubExperienceFormProps) => {
  const intl = useIntl();
  const todayDate = new Date();

  return (
    <div className="mt-3 max-w-256">
      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          id="awardTitle"
          label={labels.awardTitle}
          name="awardTitle"
          type="text"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
        <Select
          id="awardedTo"
          label={labels.awardedTo}
          name="awardedTo"
          nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          options={enumToOptions(AwardedTo, [
            AwardedTo.Me,
            AwardedTo.MyTeam,
            AwardedTo.MyProject,
            AwardedTo.MyOrganization,
          ]).map(({ value }) => ({
            value,
            label: intl.formatMessage(getAwardedTo(value)),
          }))}
        />
        <Input
          id="issuedBy"
          label={labels.issuedBy}
          name="issuedBy"
          type="text"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
        <Select
          id="awardedScope"
          label={labels.awardedScope}
          name="awardedScope"
          nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          options={enumToOptions(AwardedScope, [
            AwardedScope.International,
            AwardedScope.National,
            AwardedScope.Provincial,
            AwardedScope.Local,
            AwardedScope.Community,
            AwardedScope.Organizational,
            AwardedScope.SubOrganizational,
          ]).map(({ value }) => ({
            value,
            label: intl.formatMessage(getAwardedScope(value)),
          }))}
        />
        <div className="sm:col-span-2">
          <DateInput
            id="awardedDate"
            legend={labels.awardedDate}
            name="awardedDate"
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
      </div>
    </div>
  );
};

export default AwardFields;
