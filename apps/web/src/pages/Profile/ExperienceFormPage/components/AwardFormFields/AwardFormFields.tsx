import React from "react";
import { useIntl } from "react-intl";

import { Input, Select, enumToOptions } from "@gc-digital-talent/forms";
import {
  errorMessages,
  getAwardedTo,
  getAwardedScope,
} from "@gc-digital-talent/i18n";

import { AwardedTo, AwardedScope } from "~/api/generated";

import type { SubExperienceFormProps } from "../../types";

const AwardFormFields = ({ labels }: SubExperienceFormProps) => {
  const intl = useIntl();
  const todayDate = Date();

  return (
    <div>
      <h2 data-h2-font-size="base(h3, 1)" data-h2-margin="base(x3, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "1. Award Details",
          id: "i55f5L",
          description: "Title for Award Details Form",
        })}
      </h2>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Did you get recognized for going above and beyond? There are many ways to get recognized, awards are just one of them.",
          id: "a6c/ce",
          description: "Description blurb for Award Details Form",
        })}
      </p>
      <div data-h2-margin="base(x.5, 0, 0, 0)" data-h2-max-width="base(50rem)">
        <div data-h2-flex-grid="base(flex-start, x2, 0)">
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <Input
              id="awardTitle"
              label={labels.awardTitle}
              placeholder={intl.formatMessage({
                defaultMessage: "Write award title here...",
                id: "9ttiBB",
                description: "Placeholder for award title input",
              })}
              name="awardTitle"
              type="text"
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <Input
              id="awardedDate"
              label={labels.awardedDate}
              name="awardedDate"
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
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <Select
              id="awardedTo"
              label={labels.awardedTo}
              name="awardedTo"
              nullSelection={intl.formatMessage({
                defaultMessage: "Choose one...",
                id: "WjssQc",
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
              placeholder={intl.formatMessage({
                defaultMessage: "Write name here...",
                id: "TSqr8X",
                description: "Placeholder for issuing organization input",
              })}
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
                defaultMessage: "Choose one...",
                id: "sIM1t+",
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
    </div>
  );
};

export default AwardFormFields;
