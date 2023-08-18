import React from "react";
import { useIntl } from "react-intl";

import { Input, RadioGroup, DateInput } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import {
  ContractStartTimeframe,
  ContractValueRange,
  YesNo,
} from "@gc-digital-talent/graphql";
import { Heading, TableOfContents } from "@gc-digital-talent/ui";

import { getSectionTitle, PAGE_SECTION_ID } from "../navigation";
import { enumToOptions } from "../../util";
import {
  getContractStartTimeframe,
  getContractValueRange,
  getYesNo,
} from "../../localizedConstants";

const ScopeOfContractSection = () => {
  const intl = useIntl();

  return (
    <TableOfContents.Section
      id={PAGE_SECTION_ID.SCOPE_OF_CONTRACT}
      data-h2-padding-top="base(x2)"
    >
      <Heading data-h2-margin="base(0, 0, x1, 0)" level="h3">
        {intl.formatMessage(getSectionTitle(PAGE_SECTION_ID.SCOPE_OF_CONTRACT))}
      </Heading>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x.5)"
      >
        <Input
          id="contractTitle"
          name="contractTitle"
          type="text"
          label={intl.formatMessage({
            defaultMessage: "Contract title",
            id: "Cl3GCt",
            description:
              "Label for _contract title_ field in the _digital services contracting questionnaire_",
          })}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
        <DateInput
          name="contractStartDate"
          id="contractStartDate"
          legend={intl.formatMessage({
            defaultMessage: "Expected start date of the contract",
            id: "/Oq5UR",
            description:
              "Label for _contract start date_ field in the _digital services contracting questionnaire_",
          })}
          show={["YEAR", "MONTH"]}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
        <DateInput
          name="contractEndDate"
          id="contractEndDate"
          legend={intl.formatMessage({
            defaultMessage: "Expected end date of the contract",
            id: "bIdalW",
            description:
              "Label for _contract end date_ field in the _digital services contracting questionnaire_",
          })}
          show={["YEAR", "MONTH"]}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
        <RadioGroup
          legend={intl.formatMessage({
            defaultMessage:
              "Is the option to extend the contract currently scoped in?",
            id: "Kss450",
            description:
              "Label for _contract extendable_ fieldset in the _digital services contracting questionnaire_",
          })}
          id="contractExtendable"
          name="contractExtendable"
          idPrefix="contractExtendable"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(YesNo, [YesNo.Yes, YesNo.No]).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(getYesNo(option.value)),
            };
          })}
        />
        <RadioGroup
          legend={intl.formatMessage({
            defaultMessage:
              "Is the option to amend the contract currently scoped in?",
            id: "pjTZQr",
            description:
              "Label for _contract amendable_ fieldset in the _digital services contracting questionnaire_",
          })}
          id="contractAmendable"
          name="contractAmendable"
          idPrefix="contractAmendable"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(YesNo, [YesNo.Yes, YesNo.No]).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(getYesNo(option.value)),
            };
          })}
        />
        <RadioGroup
          legend={intl.formatMessage({
            defaultMessage: "Is this a multi-year contract?",
            id: "by9soK",
            description:
              "Label for _contract amendable_ fieldset in the _digital services contracting questionnaire_",
          })}
          id="contractMultiyear"
          name="contractMultiyear"
          idPrefix="contractMultiyear"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(YesNo, [YesNo.Yes, YesNo.No]).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(getYesNo(option.value)),
            };
          })}
        />
        <RadioGroup
          legend={intl.formatMessage({
            defaultMessage: "Total contract value",
            id: "B82PZJ",
            description:
              "Label for _contract value_ fieldset in the _digital services contracting questionnaire_",
          })}
          id="contractValue"
          name="contractValue"
          idPrefix="contractValue"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(ContractValueRange, [
            ContractValueRange.From_0To_10K,
            ContractValueRange.From_10KTo_25K,
            ContractValueRange.From_25KTo_50K,
            ContractValueRange.From_50KTo_1M,
            ContractValueRange.From_1MTo_2500K,
            ContractValueRange.From_2500KTo_5M,
            ContractValueRange.From_5MTo_10M,
            ContractValueRange.From_10MTo_15M,
            ContractValueRange.From_15MTo_25M,
            ContractValueRange.GreaterThan_25M,
          ]).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(getContractValueRange(option.value)),
            };
          })}
        />
        <RadioGroup
          legend={intl.formatMessage({
            defaultMessage: "Contract resources expected to start work in",
            id: "5GUCh4",
            description:
              "Label for _contract start timeframe_ fieldset in the _digital services contracting questionnaire_",
          })}
          id="contractResourcesStartTimeframe"
          name="contractResourcesStartTimeframe"
          idPrefix="contractResourcesStartTimeframe"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(ContractStartTimeframe, [
            ContractStartTimeframe.From_0To_3M,
            ContractStartTimeframe.From_3MTo_6M,
            ContractStartTimeframe.From_6MTo_1Y,
            ContractStartTimeframe.From_1YTo_2Y,
            ContractStartTimeframe.Unknown,
            ContractStartTimeframe.Variable,
          ]).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(
                getContractStartTimeframe(option.value),
              ),
            };
          })}
        />
      </div>
    </TableOfContents.Section>
  );
};

export default ScopeOfContractSection;
