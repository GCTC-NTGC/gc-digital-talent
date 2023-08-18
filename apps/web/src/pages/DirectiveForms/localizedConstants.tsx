import { defineMessages, MessageDescriptor } from "react-intl";
import {
  ContractAuthority,
  ContractStartTimeframe,
  ContractValueRange,
  YesNo,
  YesNoUnsure,
} from "@gc-digital-talent/graphql";

import { getOrThrowError } from "@gc-digital-talent/helpers";
import { formMessages } from "@gc-digital-talent/i18n";

const yesNoUnsureValues = defineMessages({
  [YesNoUnsure.Yes]: {
    defaultMessage: "Yes",
    id: "IKkBm7",
    description: "The affirmative option to answer a question",
  },
  [YesNoUnsure.No]: {
    defaultMessage: "No",
    id: "LTmcVS",
    description: "The negative option to answer a question",
  },
  [YesNoUnsure.IDontKnow]: {
    defaultMessage: "I don’t know",
    id: "mcZbcM",
    description: "The unsure option to answer a question",
  },
});

export const getYesNoUnsure = (
  enumKey: keyof typeof yesNoUnsureValues,
): MessageDescriptor =>
  getOrThrowError(
    yesNoUnsureValues,
    enumKey,
    `Invalid yesNoUnsure '${enumKey}'`,
  );

const yesNoValues = defineMessages({
  [YesNo.Yes]: {
    defaultMessage: "Yes",
    id: "IKkBm7",
    description: "The affirmative option to answer a question",
  },
  [YesNo.No]: {
    defaultMessage: "No",
    id: "LTmcVS",
    description: "The negative option to answer a question",
  },
});

export const getYesNo = (
  enumKey: keyof typeof yesNoValues,
): MessageDescriptor =>
  getOrThrowError(yesNoValues, enumKey, `Invalid yesNo '${enumKey}'`);

const contractAuthorities = defineMessages({
  [ContractAuthority.Hr]: {
    defaultMessage: "HR",
    id: "mSUVuL",
    description:
      "Label for _hr_ option in _authorities involved_ fieldset in the _digital services contracting questionnaire_",
  },
  [ContractAuthority.Procurement]: {
    defaultMessage: "Procurement",
    id: "WdBt7s",
    description:
      "Label for _procurement_ option in _authorities involved_ fieldset in the _digital services contracting questionnaire_",
  },
  [ContractAuthority.Finance]: {
    defaultMessage: "Finance",
    id: "XXzVNT",
    description:
      "Label for _finance_ option in _authorities involved_ fieldset in the _digital services contracting questionnaire_",
  },
  [ContractAuthority.LabourRelations]: {
    defaultMessage: "Labour relations",
    id: "RvB1GT",
    description:
      "Label for _labour relations_ option in _authorities involved_ fieldset in the _digital services contracting questionnaire_",
  },
  [ContractAuthority.Other]: formMessages.other,
} as const);

export const getContractAuthorities = (
  enumKey: keyof typeof contractAuthorities,
): MessageDescriptor =>
  getOrThrowError(
    contractAuthorities,
    enumKey,
    `Invalid contract authority '${enumKey}'`,
  );

const contractValueRanges = defineMessages({
  [ContractValueRange.From_0To_10K]: {
    defaultMessage: "$0 to <$10,000",
    id: "TO/Q6I",
    description: "Contract value range between zero and ten-thousand",
  },
  [ContractValueRange.From_10KTo_25K]: {
    defaultMessage: "$10,000 to <$25,000",
    id: "ghhKNZ",
    description:
      "Contract value range between ten-thousand and twenty-five-thousand",
  },
  [ContractValueRange.From_25KTo_50K]: {
    defaultMessage: "$25,000 to <$50,000",
    id: "ghhKNZ",
    description:
      "Contract value range between twenty-five-thousand and fifty-thousand",
  },
  [ContractValueRange.From_50KTo_1M]: {
    defaultMessage: "$50,000 to <$1 million",
    id: "ghhKNZ",
    description: "Contract value range between fifty-thousand and one-million",
  },
  [ContractValueRange.From_1MTo_2500K]: {
    defaultMessage: "$1 million to <$2.5 million",
    id: "ghhKNZ",
    description:
      "Contract value range between one-million and two-point-five-million",
  },
  [ContractValueRange.From_2500KTo_5M]: {
    defaultMessage: "$2.5 million to <$5 million",
    id: "ghhKNZ",
    description:
      "Contract value range between two-point-five-million and five-million",
  },
  [ContractValueRange.From_5MTo_10M]: {
    defaultMessage: "$5 million to <$10 million",
    id: "ghhKNZ",
    description: "Contract value range between five-million and ten-million",
  },
  [ContractValueRange.From_10MTo_15M]: {
    defaultMessage: "$10 million to <$15 million",
    id: "ghhKNZ",
    description: "Contract value range between ten-million and fifteen-million",
  },
  [ContractValueRange.From_15MTo_25M]: {
    defaultMessage: "$15 million to <$25 million",
    id: "ghhKNZ",
    description:
      "Contract value range between fifteen-million and twenty-five-million",
  },
  [ContractValueRange.GreaterThan_25M]: {
    defaultMessage: ">$25 million",
    id: "ghhKNZ",
    description: "Contract value range greater than twenty-five-million",
  },
} as const);

export const getContractValueRange = (
  enumKey: keyof typeof contractValueRanges,
): MessageDescriptor =>
  getOrThrowError(
    contractValueRanges,
    enumKey,
    `Invalid contract value range '${enumKey}'`,
  );

const contractStartTimeframes = defineMessages({
  [ContractStartTimeframe.From_0To_3M]: {
    defaultMessage: "0 to 3 months",
    id: "TO/Q6I",
    description: "Contract start timeframe of zero to three months",
  },
  [ContractStartTimeframe.From_3MTo_6M]: {
    defaultMessage: "3 to 6 months",
    id: "TO/Q6I",
    description: "Contract start timeframe of three to six months",
  },
  [ContractStartTimeframe.From_6MTo_1Y]: {
    defaultMessage: "6 to 12 months",
    id: "TO/Q6I",
    description: "Contract start timeframe of six to twelve months",
  },
  [ContractStartTimeframe.From_1YTo_2Y]: {
    defaultMessage: "1 to 2 years",
    id: "TO/Q6I",
    description: "Contract start timeframe of one to two years",
  },
  [ContractStartTimeframe.Unknown]: {
    defaultMessage: "Unknown",
    id: "TO/Q6I",
    description: "Contract start timeframe is unknown",
  },
  [ContractStartTimeframe.Variable]: {
    defaultMessage: "Variable",
    id: "TO/Q6I",
    description: "Contract start timeframe is variable",
  },
} as const);

export const getContractStartTimeframe = (
  enumKey: keyof typeof contractStartTimeframes,
): MessageDescriptor =>
  getOrThrowError(
    contractStartTimeframes,
    enumKey,
    `Invalid contract start timeframe '${enumKey}'`,
  );
