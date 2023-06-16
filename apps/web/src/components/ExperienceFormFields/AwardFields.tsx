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
} from "@gc-digital-talent/i18n";
import { strToFormDate } from "@gc-digital-talent/date-helpers";

import { SubExperienceFormProps } from "~/types/experience";
import { AwardedScope, AwardedTo } from "~/api/generated";

const AwardFields = ({ labels }: SubExperienceFormProps) => {
  const intl = useIntl();
  const todayDate = new Date();

  return (
    <div data-h2-margin="base(x.5, 0, 0, 0)" data-h2-max-width="base(50rem)">
      <div data-h2-flex-grid="base(flex-start, x2, x1)">
        <div
          data-h2-flex-item="base(1of1) p-tablet(1of2)"
          data-h2-align-self="base(flex-end)"
        >
          <Input
            id="awardTitle"
            label={labels.awardTitle}
            name="awardTitle"
            type="text"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
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
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <Select
            id="awardedTo"
            label={labels.awardedTo}
            name="awardedTo"
            nullSelection={intl.formatMessage({
              defaultMessage: "Select an option",
              id: "KWLDYe",
              description:
                "Null selection for select input in the awarded to form.",
            })}
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
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <Input
            id="issuedBy"
            label={labels.issuedBy}
            name="issuedBy"
            type="text"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
        </div>
        <div data-h2-flex-item="base(1of1)">
          <Select
            id="awardedScope"
            label={labels.awardedScope}
            name="awardedScope"
            nullSelection={intl.formatMessage({
              defaultMessage: "Select an option",
              id: "xyHtkt",
              description:
                "Null selection for select input in the award scope form.",
            })}
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
        </div>
      </div>
    </div>
  );
};

export default AwardFields;
