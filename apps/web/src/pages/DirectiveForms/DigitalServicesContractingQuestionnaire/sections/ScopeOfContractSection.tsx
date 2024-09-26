import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import { Input, RadioGroup, DateInput } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { Heading, TableOfContents } from "@gc-digital-talent/ui";
import {
  ContractCommodity,
  ContractFteRange,
  ContractInstrument,
  ContractSolicitationProcedure,
  ContractStartTimeframe,
  ContractSupplyMethod,
  ContractValueRange,
  YesNo,
  YesNoUnsure,
} from "@gc-digital-talent/graphql";

import { getSectionTitle, PAGE_SECTION_ID } from "../navigation";
import { enumToOptions } from "../../util";
import {
  contractFteRangeSortOrder,
  contractInstrumentSortOrder,
  contractSolicitationProcedureSortOrder,
  contractStartTimeframeSortOrder,
  contractSupplyMethodSortOrder,
  contractValueRangeSortOrder,
  getContractCommodity,
  getContractCommoditySortOrder,
  getContractFteRange,
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
import useLabels from "../useLabels";
import CompoundQuestion from "../../CompoundQuestion";

const ScopeOfContractSection = () => {
  const intl = useIntl();
  const { watch, resetField } = useFormContext();
  const labels = useLabels();

  // hooks to watch, needed for conditional rendering
  const [
    selectedCommodityType,
    selectedMethodOfSupply,
    selectedInstrumentType,
    selectedContractStartDate,
  ] = watch([
    "commodityType",
    "methodOfSupply",
    "instrumentType",
    "contractStartDate",
  ]);
  const isCommodityTypeOther =
    selectedCommodityType === ContractCommodity.Other;
  const isMethodOfSupplyOther =
    selectedMethodOfSupply === ContractSupplyMethod.Other;
  const isInstrumentTypeOther =
    selectedInstrumentType === ContractInstrument.Other;

  useEffect(() => {
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
    if (!isInstrumentTypeOther) {
      resetDirtyField("instrumentTypeOther");
    }
  }, [
    resetField,
    isCommodityTypeOther,
    isMethodOfSupplyOther,
    isInstrumentTypeOther,
  ]);

  return (
    <TableOfContents.Section id={PAGE_SECTION_ID.SCOPE_OF_CONTRACT}>
      <Heading
        data-h2-margin="base(x3, 0, x1, 0)"
        level="h3"
        size="h4"
        data-h2-font-weight="base(700)"
      >
        {intl.formatMessage(getSectionTitle(PAGE_SECTION_ID.SCOPE_OF_CONTRACT))}
      </Heading>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1)"
      >
        <Input
          id="contractTitle"
          name="contractTitle"
          type="text"
          label={labels.contractTitle}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
        <DateInput
          name="contractStartDate"
          id="contractStartDate"
          legend={labels.contractStartDate}
          show={["YEAR", "MONTH"]}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
        <DateInput
          name="contractEndDate"
          id="contractEndDate"
          legend={labels.contractEndDate}
          show={["YEAR", "MONTH"]}
          rules={{
            required: intl.formatMessage(errorMessages.required),
            min: {
              value: selectedContractStartDate,
              message: String(
                intl.formatMessage(errorMessages.mustBeGreater, {
                  value: selectedContractStartDate,
                }),
              ),
            },
          }}
        />
        <RadioGroup
          legend={labels.contractExtendable}
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
          legend={labels.contractAmendable}
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
          legend={labels.contractMultiyear}
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
        <CompoundQuestion
          title={intl.formatMessage({
            defaultMessage: "Total contract value",
            id: "2f+IKU",
            description:
              "Title for _contract value_ fieldset in the _digital services contracting questionnaire_",
          })}
          introduction={intl.formatMessage({
            defaultMessage:
              "If there has been an amendment to the contract, select the total value after the amendment.",
            id: "WHMukc",
            description:
              "introduction for _contract value_ fieldset in the _digital services contracting questionnaire_",
          })}
          inputElement={
            <RadioGroup
              legend={labels.contractValue}
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
                  label: intl.formatMessage(
                    getContractValueRange(option.value),
                  ),
                };
              })}
            />
          }
        />
        <RadioGroup
          legend={labels.contractFtes}
          id="contractFtes"
          name="contractFtes"
          idPrefix="contractFtes"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(ContractFteRange, contractFteRangeSortOrder).map(
            (option) => {
              return {
                value: option.value as string,
                label: intl.formatMessage(getContractFteRange(option.value)),
              };
            },
          )}
        />
        <RadioGroup
          legend={labels.contractResourcesStartTimeframe}
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
          legend={labels.commodityType}
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
            label={labels.commodityTypeOther}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        ) : null}
        <RadioGroup
          legend={labels.instrumentType}
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
        {isInstrumentTypeOther ? (
          <Input
            id="instrumentTypeOther"
            name="instrumentTypeOther"
            type="text"
            label={labels.instrumentTypeOther}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        ) : null}
        <RadioGroup
          legend={labels.methodOfSupply}
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
            label={labels.methodOfSupplyOther}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        ) : null}
        <RadioGroup
          legend={labels.solicitationProcedure}
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
        <CompoundQuestion
          title={intl.formatMessage({
            defaultMessage: "Trade agreement information",
            id: "ekDavD",
            description:
              "Title for _trade agreement_ fieldset in the _digital services contracting questionnaire_",
          })}
          introduction={intl.formatMessage({
            defaultMessage:
              "Is this contract subject to trade agreements such as the North American Free Trade Agreement (NAFTA) or U.S. – Mexico – Canada Agreement (USMCA)?",
            id: "lGUfLc",
            description:
              "Introduction for _trade agreement_ fieldset in the _digital services contracting questionnaire_",
          })}
          inputElement={
            <RadioGroup
              legend={labels.subjectToTradeAgreement}
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
          }
        />
      </div>
    </TableOfContents.Section>
  );
};

export default ScopeOfContractSection;
