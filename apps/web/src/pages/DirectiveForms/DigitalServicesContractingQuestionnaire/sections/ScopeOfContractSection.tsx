import React from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import { Input, RadioGroup, DateInput } from "@gc-digital-talent/forms";
import { errorMessages, formMessages } from "@gc-digital-talent/i18n";
import {
  ContractCommodity,
  ContractInstrument,
  ContractSolicitationProcedure,
  ContractStartTimeframe,
  ContractSupplyMethod,
  ContractValueRange,
  YesNo,
  YesNoUnsure,
} from "@gc-digital-talent/graphql";
import { Heading, TableOfContents } from "@gc-digital-talent/ui";

import { getSectionTitle, PAGE_SECTION_ID } from "../navigation";
import { enumToOptions } from "../../util";
import {
  contractInstrumentSortOrder,
  contractSolicitationProcedureSortOrder,
  contractStartTimeframeSortOrder,
  contractSupplyMethodSortOrder,
  contractValueRangeSortOrder,
  getContractCommodity,
  getContractCommoditySortOrder,
  getContractInstrument,
  getContractSolicitationProcedure,
  getContractStartTimeframe,
  getContractSupplyMethod,
  getContractValueRange,
  getYesNo,
  getYesNoUnsure,
  yesNoSortOrder,
  yesNoUnsureSortOrder,
} from "../../localizedConstants";

const ScopeOfContractSection = () => {
  const intl = useIntl();
  const { watch, resetField } = useFormContext();

  // hooks to watch, needed for conditional rendering
  const [selectedCommodityType, selectedMethodOfSupply] = watch([
    "commodityType",
    "methodOfSupply",
  ]);
  const isCommodityTypeOther =
    selectedCommodityType === ContractCommodity.Other;
  const isMethodOfSupplyOther =
    selectedMethodOfSupply === ContractSupplyMethod.Other;

  React.useEffect(() => {
    const resetDirtyField = (name: string) => {
      resetField(name, { keepDirty: false, defaultValue: null });
    };

    // Reset all optional fields
    if (!isCommodityTypeOther) {
      resetDirtyField("commodityTypeOther");
    }
    if (!isMethodOfSupplyOther) {
      resetDirtyField("methodOfSupplyOther");
    }
  }, [resetField, isCommodityTypeOther, isMethodOfSupplyOther]);

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
          items={enumToOptions(YesNo, yesNoSortOrder).map((option) => {
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
          items={enumToOptions(YesNo, yesNoSortOrder).map((option) => {
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
          items={enumToOptions(YesNo, yesNoSortOrder).map((option) => {
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
          items={enumToOptions(
            ContractValueRange,
            contractValueRangeSortOrder,
          ).map((option) => {
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
          items={enumToOptions(
            ContractStartTimeframe,
            contractStartTimeframeSortOrder,
          ).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(
                getContractStartTimeframe(option.value),
              ),
            };
          })}
        />
        <RadioGroup
          legend={intl.formatMessage({
            defaultMessage: "Commodity type",
            id: "lDRl7g",
            description:
              "Label for _commodity type_ fieldset in the _digital services contracting questionnaire_",
          })}
          id="commodityType"
          name="commodityType"
          idPrefix="commodityType"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(
            ContractCommodity,
            getContractCommoditySortOrder,
          ).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(getContractCommodity(option.value)),
            };
          })}
        />
        {isCommodityTypeOther ? (
          <Input
            id="commodityTypeOther"
            name="commodityTypeOther"
            type="text"
            label={intl.formatMessage(formMessages.specifyOther)}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        ) : null}
        <RadioGroup
          legend={intl.formatMessage({
            defaultMessage: "Instrument type",
            id: "5pyCTN",
            description:
              "Label for _instrument type_ fieldset in the _digital services contracting questionnaire_",
          })}
          id="instrumentType"
          name="instrumentType"
          idPrefix="instrumentType"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(
            ContractInstrument,
            contractInstrumentSortOrder,
          ).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(getContractInstrument(option.value)),
            };
          })}
        />
        <RadioGroup
          legend={intl.formatMessage({
            defaultMessage: "Method of supply",
            id: "YRZ5Cx",
            description:
              "Label for _method of supply_ fieldset in the _digital services contracting questionnaire_",
          })}
          id="methodOfSupply"
          name="methodOfSupply"
          idPrefix="methodOfSupply"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(
            ContractSupplyMethod,
            contractSupplyMethodSortOrder,
          ).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(getContractSupplyMethod(option.value)),
            };
          })}
        />
        {isMethodOfSupplyOther ? (
          <Input
            id="methodOfSupplyOther"
            name="methodOfSupplyOther"
            type="text"
            label={intl.formatMessage(formMessages.specifyOther)}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        ) : null}
        <RadioGroup
          legend={intl.formatMessage({
            defaultMessage: "Solicitation procedure",
            id: "GsHDxH",
            description:
              "Label for _solicitation procedure_ fieldset in the _digital services contracting questionnaire_",
          })}
          id="solicitationProcedure"
          name="solicitationProcedure"
          idPrefix="solicitationProcedure"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(
            ContractSolicitationProcedure,
            contractSolicitationProcedureSortOrder,
          ).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(
                getContractSolicitationProcedure(option.value),
              ),
            };
          })}
        />
        <RadioGroup
          legend={intl.formatMessage({
            defaultMessage: "This contract is subject to trade agreement",
            id: "wbLfq4",
            description:
              "Label for _trade agreement_ fieldset in the _digital services contracting questionnaire_",
          })}
          id="subjectToTradeAgreement"
          name="subjectToTradeAgreement"
          idPrefix="subjectToTradeAgreement"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(YesNoUnsure, yesNoUnsureSortOrder).map(
            (option) => {
              return {
                value: option.value as string,
                label: intl.formatMessage(getYesNoUnsure(option.value)),
              };
            },
          )}
        />
      </div>
    </TableOfContents.Section>
  );
};

export default ScopeOfContractSection;
