import React from "react";
import { useIntl } from "react-intl";
import Input from "@common/components/form/Input";
import Select from "@common/components/form/Select";
import { errorMessages } from "@common/messages";
import { enumToOptions } from "@common/helpers/formUtils";
import {
  getAwardedTo,
  getAwardedScope,
} from "@common/constants/localizedConstants";
import { AwardedTo, AwardedScope } from "../../api/generated";

export const AwardDetailsForm: React.FunctionComponent = () => {
  const intl = useIntl();

  return (
    <div>
      <h2 data-h2-font-size="base(h3, 1)" data-h2-margin="base(x2, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "1. Award Details",
          description: "Title for Award Details Form",
        })}
      </h2>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Did you get recognized for going above and beyond? There are many ways to get recognized, awards are just one of them.",
          description: "Description blurb for Award Details Form",
        })}
      </p>
      <div data-h2-margin="base(x.5, 0, 0, 0)" data-h2-max-width="base(50rem)">
        <div data-h2-flex-grid="base(flex-start, 0, x2, 0)">
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <Input
              id="awardTitle"
              label={intl.formatMessage({
                defaultMessage: "Award Title",
                description:
                  "Label displayed on award form for award title input",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Write award title here...",
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
              label={intl.formatMessage({
                defaultMessage: "Date Awarded",
                description:
                  "Label displayed on award form for date awarded input",
              })}
              name="awardedDate"
              type="date"
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <Select
              id="awardedTo"
              label={intl.formatMessage({
                defaultMessage: "Awarded to",
                description:
                  "Label displayed on Award form for awarded to input",
              })}
              name="awardedTo"
              nullSelection={intl.formatMessage({
                defaultMessage: "Choose one...",
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
              label={intl.formatMessage({
                defaultMessage: "Issuing Organization or Institution",
                description:
                  "Label displayed on award form for issuing organization input",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Write name here...",
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
              label={intl.formatMessage({
                defaultMessage: "Award Scope",
                description:
                  "Label displayed on Award form for award scope input",
              })}
              name="awardedScope"
              nullSelection={intl.formatMessage({
                defaultMessage: "Choose one...",
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

export default AwardDetailsForm;
