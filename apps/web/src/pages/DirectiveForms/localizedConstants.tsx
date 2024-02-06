import { defineMessages, MessageDescriptor } from "react-intl";

import { getOrThrowError } from "@gc-digital-talent/helpers";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";

import {
  ContractAuthority,
  ContractCommodity,
  ContractFteRange,
  ContractingRationale,
  ContractInstrument,
  ContractSolicitationProcedure,
  ContractStartTimeframe,
  ContractSupplyMethod,
  ContractValueRange,
  OperationsConsideration,
  PersonnelLanguage,
  PersonnelOtherRequirement,
  PersonnelScreeningLevel,
  PersonnelTeleworkOption,
  PersonnelWorkLocation,
  YesNo,
  YesNoUnsure,
} from "~/api/generated";

const yesNoUnsureValues = defineMessages({
  [YesNoUnsure.Yes]: {
    defaultMessage: "Yes",
    id: "IKkBm7",
    description: "The affirmative option to answer a question",
  },
  [YesNoUnsure.IDontKnow]: {
    defaultMessage: "I don’t know",
    id: "mcZbcM",
    description: "The unsure option to answer a question",
  },
  [YesNoUnsure.No]: commonMessages.no,
});

export const getYesNoUnsure = (
  enumKey: keyof typeof yesNoUnsureValues,
): MessageDescriptor =>
  getOrThrowError(
    yesNoUnsureValues,
    enumKey,
    `Invalid yesNoUnsure '${enumKey}'`,
  );

export const yesNoUnsureSortOrder = [
  YesNoUnsure.Yes,
  YesNoUnsure.No,
  YesNoUnsure.IDontKnow,
];

const yesNoValues = defineMessages({
  [YesNo.Yes]: {
    defaultMessage: "Yes",
    id: "IKkBm7",
    description: "The affirmative option to answer a question",
  },
  [YesNo.No]: commonMessages.no,
});

export const yesNoSortOrder = [YesNo.Yes, YesNo.No];

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
});

export const getContractAuthorities = (
  enumKey: keyof typeof contractAuthorities,
): MessageDescriptor =>
  getOrThrowError(
    contractAuthorities,
    enumKey,
    `Invalid contract authority '${enumKey}'`,
  );

export const contractAuthoritySortOrder = [
  ContractAuthority.Hr,
  ContractAuthority.Procurement,
  ContractAuthority.Finance,
  ContractAuthority.LabourRelations,
  ContractAuthority.Other,
];

const contractValueRanges = defineMessages({
  [ContractValueRange.From_0To_10K]: {
    defaultMessage: "$0 to $10,000",
    id: "FjqRUc",
    description: "Contract value range between zero and ten-thousand",
  },
  [ContractValueRange.From_10KTo_25K]: {
    defaultMessage: "$10,000 to $25,000",
    id: "YWPvor",
    description:
      "Contract value range between ten-thousand and twenty-five-thousand",
  },
  [ContractValueRange.From_25KTo_50K]: {
    defaultMessage: "$25,000 to $50,000",
    id: "KFdDjj",
    description:
      "Contract value range between twenty-five-thousand and fifty-thousand",
  },
  [ContractValueRange.From_50KTo_1M]: {
    defaultMessage: "$50,000 to $1 million",
    id: "txq9ha",
    description: "Contract value range between fifty-thousand and one-million",
  },
  [ContractValueRange.From_1MTo_2500K]: {
    defaultMessage: "$1 million to $2.5 million",
    id: "HMm2S4",
    description:
      "Contract value range between one-million and two-point-five-million",
  },
  [ContractValueRange.From_2500KTo_5M]: {
    defaultMessage: "$2.5 million to $5 million",
    id: "fLTOAm",
    description:
      "Contract value range between two-point-five-million and five-million",
  },
  [ContractValueRange.From_5MTo_10M]: {
    defaultMessage: "$5 million to $10 million",
    id: "deFarB",
    description: "Contract value range between five-million and ten-million",
  },
  [ContractValueRange.From_10MTo_15M]: {
    defaultMessage: "$10 million to $15 million",
    id: "iruU4c",
    description: "Contract value range between ten-million and fifteen-million",
  },
  [ContractValueRange.From_15MTo_25M]: {
    defaultMessage: "$15 million to $25 million",
    id: "PBAxdK",
    description:
      "Contract value range between fifteen-million and twenty-five-million",
  },
  [ContractValueRange.GreaterThan_25M]: {
    defaultMessage: "Greater than $25 million",
    id: "99D3id",
    description: "Contract value range greater than twenty-five-million",
  },
});

export const getContractValueRange = (
  enumKey: keyof typeof contractValueRanges,
): MessageDescriptor =>
  getOrThrowError(
    contractValueRanges,
    enumKey,
    `Invalid contract value range '${enumKey}'`,
  );

export const contractValueRangeSortOrder = [
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
];

const ContractFteRanges = defineMessages({
  [ContractFteRange.From_1To_5]: {
    defaultMessage: "1 to 5",
    id: "wXLoar",
    description: "Contract FTE range between one and five",
  },
  [ContractFteRange.From_6To_10]: {
    defaultMessage: "6 to 10",
    id: "OWD/ns",
    description: "Contract FTE range between six and ten",
  },
  [ContractFteRange.From_11To_30]: {
    defaultMessage: "11 to 30",
    id: "Xhq/96",
    description: "Contract FTE range between eleven and thirty",
  },
  [ContractFteRange.From_31To_50]: {
    defaultMessage: "31 to 50",
    id: "DUlWNu",
    description: "Contract FTE range between thirty-one and fifty",
  },
  [ContractFteRange.From_51To_100]: {
    defaultMessage: "51 to 100",
    id: "pgPBbf",
    description: "Contract FTE range between fifty-one and one-hundred",
  },
  [ContractFteRange.GreaterThan_100]: {
    defaultMessage: "Greater than 100",
    id: "DhU+iu",
    description: "Contract FTE range greater than one-hundred",
  },
});

export const getContractFteRange = (
  enumKey: keyof typeof ContractFteRanges,
): MessageDescriptor =>
  getOrThrowError(
    ContractFteRanges,
    enumKey,
    `Invalid contract FTE range '${enumKey}'`,
  );

export const contractFteRangeSortOrder = [
  ContractFteRange.From_1To_5,
  ContractFteRange.From_6To_10,
  ContractFteRange.From_11To_30,
  ContractFteRange.From_31To_50,
  ContractFteRange.From_51To_100,
  ContractFteRange.GreaterThan_100,
];

const contractStartTimeframes = defineMessages({
  [ContractStartTimeframe.From_0To_3M]: {
    defaultMessage: "0 to 3 months",
    id: "qUkJSG",
    description: "Contract start timeframe of zero to three months",
  },
  [ContractStartTimeframe.From_3MTo_6M]: {
    defaultMessage: "3 to 6 months",
    id: "UNLuiP",
    description: "Contract start timeframe of three to six months",
  },
  [ContractStartTimeframe.From_6MTo_1Y]: {
    defaultMessage: "6 to 12 months",
    id: "oOPwam",
    description: "Contract start timeframe of six to twelve months",
  },
  [ContractStartTimeframe.From_1YTo_2Y]: {
    defaultMessage: "1 to 2 years",
    id: "JqP2TC",
    description: "Contract start timeframe of one to two years",
  },
  [ContractStartTimeframe.Unknown]: {
    defaultMessage: "Unknown",
    id: "Mxu+IY",
    description: "Contract start timeframe is unknown",
  },
  [ContractStartTimeframe.Variable]: {
    defaultMessage: "Variable",
    id: "a5FZSP",
    description: "Contract start timeframe is variable",
  },
});

export const getContractStartTimeframe = (
  enumKey: keyof typeof contractStartTimeframes,
): MessageDescriptor =>
  getOrThrowError(
    contractStartTimeframes,
    enumKey,
    `Invalid contract start timeframe '${enumKey}'`,
  );

export const contractStartTimeframeSortOrder = [
  ContractStartTimeframe.From_0To_3M,
  ContractStartTimeframe.From_3MTo_6M,
  ContractStartTimeframe.From_6MTo_1Y,
  ContractStartTimeframe.From_1YTo_2Y,
  ContractStartTimeframe.Unknown,
  ContractStartTimeframe.Variable,
];

const contractCommodities = defineMessages({
  [ContractCommodity.TelecomServices]: {
    defaultMessage: "Information processing and related telecom services",
    id: "hNq2Lk",
    description: "Telecom services contract commodity",
  },
  [ContractCommodity.SupportServices]: {
    defaultMessage:
      "Professional, administrative, and management support services",
    id: "s7Uy7q",
    description: "Support services contract commodity",
  },
  [ContractCommodity.Other]: formMessages.other,
});

export const getContractCommodity = (
  enumKey: keyof typeof contractCommodities,
): MessageDescriptor =>
  getOrThrowError(
    contractCommodities,
    enumKey,
    `Invalid contract commodity '${enumKey}'`,
  );

export const getContractCommoditySortOrder = [
  ContractCommodity.TelecomServices,
  ContractCommodity.SupportServices,
  ContractCommodity.Other,
];

const contractInstruments = defineMessages({
  [ContractInstrument.SupplyArrangement]: {
    defaultMessage: "Supply arrangement",
    id: "3jfmAz",
    description: "Supply arrangement contract instrument",
  },
  [ContractInstrument.StandingOffer]: {
    defaultMessage: "Standing offer",
    id: "4Gh12/",
    description: "Standing offer contract instrument",
  },
  [ContractInstrument.Contract]: {
    defaultMessage: "Contract",
    id: "mR9A3a",
    description: "Contract contract instrument",
  },
  [ContractInstrument.Amendment]: {
    defaultMessage: "Amendment",
    id: "mieIXc",
    description: "Amendment contract instrument",
  },
  [ContractInstrument.Other]: formMessages.other,
});

export const getContractInstrument = (
  enumKey: keyof typeof contractInstruments,
): MessageDescriptor =>
  getOrThrowError(
    contractInstruments,
    enumKey,
    `Invalid contract instrument '${enumKey}'`,
  );

export const contractInstrumentSortOrder = [
  ContractInstrument.SupplyArrangement,
  ContractInstrument.StandingOffer,
  ContractInstrument.Contract,
  ContractInstrument.Amendment,
  ContractInstrument.Other,
];

const contractSupplyMethods = defineMessages({
  [ContractSupplyMethod.NotApplicable]: {
    defaultMessage: "Not applicable (N/A)",
    id: "xM6U6U",
    description: "Not applicable contract supply method",
  },
  [ContractSupplyMethod.SolutionsBasedInformaticsProfessionalServices]: {
    defaultMessage: "Solutions based informatics professional services (SBIPS)",
    id: "NeY5Ac",
    description:
      "Solutions based informatics professional services contract supply method",
  },
  [ContractSupplyMethod.TaskBasedInformaticsProfessionalServices]: {
    defaultMessage: "Task based informatics professional services (TBIPS)",
    id: "ha+vp4",
    description:
      "Task based informatics professional services contract supply method",
  },
  [ContractSupplyMethod.TemporaryHelp]: {
    defaultMessage: "Temporary help services",
    id: "RogeBe",
    description: "Temporary help services contract supply method",
  },
  [ContractSupplyMethod.Other]: formMessages.other,
});

export const getContractSupplyMethod = (
  enumKey: keyof typeof contractSupplyMethods,
): MessageDescriptor =>
  getOrThrowError(
    contractSupplyMethods,
    enumKey,
    `Invalid contract supply method '${enumKey}'`,
  );

export const contractSupplyMethodSortOrder = [
  ContractSupplyMethod.NotApplicable,
  ContractSupplyMethod.SolutionsBasedInformaticsProfessionalServices,
  ContractSupplyMethod.TaskBasedInformaticsProfessionalServices,
  ContractSupplyMethod.TemporaryHelp,
  ContractSupplyMethod.Other,
];

const contractSolicitationProcedures = defineMessages({
  [ContractSolicitationProcedure.AdvanceContractAwardNotice]: {
    defaultMessage: "Advance contract award notice",
    id: "VmMnkU",
    description:
      "Advance contract award notice contract solicitation procedure",
  },
  [ContractSolicitationProcedure.Competitive]: {
    defaultMessage:
      "Competitive (open bidding / selective tendering / traditional)",
    id: "oTs24h",
    description: "Competitive contract solicitation procedure",
  },
  [ContractSolicitationProcedure.NonCompetitive]: {
    defaultMessage: "Non-competitive (sole source)",
    id: "4SNM1S",
    description: "Non-competitive contract solicitation procedure",
  },
});

export const getContractSolicitationProcedure = (
  enumKey: keyof typeof contractSolicitationProcedures,
): MessageDescriptor =>
  getOrThrowError(
    contractSolicitationProcedures,
    enumKey,
    `Invalid contract solicitation procedure '${enumKey}'`,
  );

export const contractSolicitationProcedureSortOrder = [
  ContractSolicitationProcedure.AdvanceContractAwardNotice,
  ContractSolicitationProcedure.Competitive,
  ContractSolicitationProcedure.NonCompetitive,
];

const personnelScreeningLevels = defineMessages({
  [PersonnelScreeningLevel.Reliability]: {
    defaultMessage: "Reliability",
    id: "KKXJFE",
    description: "Reliability screening level",
  },
  [PersonnelScreeningLevel.EnhancedReliability]: {
    defaultMessage: "Enhanced reliability",
    id: "X28mdy",
    description: "Enhanced reliability screening level",
  },
  [PersonnelScreeningLevel.Secret]: {
    defaultMessage: "Secret",
    id: "HX/Tj+",
    description: "Secret screening level",
  },
  [PersonnelScreeningLevel.TopSecret]: {
    defaultMessage: "Top secret",
    id: "hnrC2A",
    description: "Top secret screening level",
  },
  [PersonnelScreeningLevel.Other]: formMessages.other,
});

export const getPersonnelScreeningLevel = (
  enumKey: keyof typeof personnelScreeningLevels,
): MessageDescriptor =>
  getOrThrowError(
    personnelScreeningLevels,
    enumKey,
    `Invalid personnel screening level '${enumKey}'`,
  );

export const personnelScreeningLevelSortOrder = [
  PersonnelScreeningLevel.Reliability,
  PersonnelScreeningLevel.EnhancedReliability,
  PersonnelScreeningLevel.Secret,
  PersonnelScreeningLevel.TopSecret,
  PersonnelScreeningLevel.Other,
];

const personnelLanguages = defineMessages({
  [PersonnelLanguage.EnglishOnly]: {
    defaultMessage: "English only",
    id: "BuXxS9",
    description: "English only personnel language",
  },
  [PersonnelLanguage.FrenchOnly]: {
    defaultMessage: "French only",
    id: "19wJhE",
    description: "French only personnel language",
  },
  [PersonnelLanguage.BilingualIntermediate]: {
    defaultMessage: "Bilingual (Intermediate - BBB/BBB)",
    id: "yCHFQo",
    description: "Bilingual intermediate personnel language",
  },
  [PersonnelLanguage.BilingualAdvanced]: {
    defaultMessage: "Bilingual (Advanced - CBC/CBC)",
    id: "KeMgYF",
    description: "Bilingual advanced personnel language",
  },
  [PersonnelLanguage.Other]: formMessages.other,
});

export const getPersonnelLanguage = (
  enumKey: keyof typeof personnelLanguages,
): MessageDescriptor =>
  getOrThrowError(
    personnelLanguages,
    enumKey,
    `Invalid personnel language '${enumKey}'`,
  );

export const personnelLanguageSortOrder = [
  PersonnelLanguage.EnglishOnly,
  PersonnelLanguage.FrenchOnly,
  PersonnelLanguage.BilingualIntermediate,
  PersonnelLanguage.BilingualAdvanced,
  PersonnelLanguage.Other,
];

const personnelWorkLocations = defineMessages({
  [PersonnelWorkLocation.GcPremises]: {
    defaultMessage: "GC premises",
    id: "kMoUof",
    description: "GC premises personnel work location",
  },
  [PersonnelWorkLocation.OffsiteSpecific]: {
    defaultMessage: "Offsite, specific location",
    id: "NT0U2K",
    description: "Specific offsite personnel work location",
  },
  [PersonnelWorkLocation.OffsiteAny]: {
    defaultMessage: "Offsite, any location",
    id: "9o9XhC",
    description: "Any offsite personnel work location",
  },
});

export const getPersonnelWorkLocation = (
  enumKey: keyof typeof personnelWorkLocations,
): MessageDescriptor =>
  getOrThrowError(
    personnelWorkLocations,
    enumKey,
    `Invalid personnel work location '${enumKey}'`,
  );

export const personnelWorkLocationSortOrder = [
  PersonnelWorkLocation.GcPremises,
  PersonnelWorkLocation.OffsiteSpecific,
  PersonnelWorkLocation.OffsiteAny,
];

const personnelOtherRequirements = defineMessages({
  [PersonnelOtherRequirement.ShiftWork]: {
    defaultMessage: "Shift work",
    id: "AbU5rL",
    description: "Shift work personnel other requirement",
  },
  [PersonnelOtherRequirement.OnCall_24_7]: {
    defaultMessage: "On-call 24/7",
    id: "QaLQPG",
    description: "On-call 24/7 personnel other requirement",
  },
  [PersonnelOtherRequirement.OvertimeShortNotice]: {
    defaultMessage: "Overtime on short notice",
    id: "s9unRt",
    description: "Overtime on short notice personnel other requirement",
  },
  [PersonnelOtherRequirement.AsNeeded]: {
    defaultMessage: "As and when needed",
    id: "/rmunL",
    description: "As and when needed personnel other requirement",
  },
  [PersonnelOtherRequirement.Other]: formMessages.other,
});

export const getPersonnelOtherRequirement = (
  enumKey: keyof typeof personnelOtherRequirements,
): MessageDescriptor =>
  getOrThrowError(
    personnelOtherRequirements,
    enumKey,
    `Invalid personnel other requirement '${enumKey}'`,
  );

export const personnelOtherRequirementSortOrder = [
  PersonnelOtherRequirement.ShiftWork,
  PersonnelOtherRequirement.OnCall_24_7,
  PersonnelOtherRequirement.OvertimeShortNotice,
  PersonnelOtherRequirement.AsNeeded,
  PersonnelOtherRequirement.Other,
];

const personnelTeleworkOptions = defineMessages({
  [PersonnelTeleworkOption.FullTime]: {
    defaultMessage: "Yes, full-time",
    id: "sQxZhr",
    description: "Full-time personnel telework option",
  },
  [PersonnelTeleworkOption.PartTime]: {
    defaultMessage: "Yes, part-time",
    id: "hP2Dxo",
    description: "Part-time personnel telework option",
  },
  [PersonnelTeleworkOption.No]: commonMessages.no,
});

export const getPersonnelTeleworkOption = (
  enumKey: keyof typeof personnelTeleworkOptions,
): MessageDescriptor =>
  getOrThrowError(
    personnelTeleworkOptions,
    enumKey,
    `Invalid personnel telework option '${enumKey}'`,
  );

export const personnelTeleworkOptionSortOrder = [
  PersonnelTeleworkOption.FullTime,
  PersonnelTeleworkOption.PartTime,
  PersonnelTeleworkOption.No,
];

const operationsConsiderations = defineMessages({
  [OperationsConsideration.FinanceVehicleNotUsable]: {
    defaultMessage:
      "The finance vehicle available cannot be used for staffing (unable to use available funding for staffing)",
    id: "t28EG0",
    description: "Finance vehicle not usable operations consideration",
  },
  [OperationsConsideration.FundingSecuredCostRecoveryBasis]: {
    defaultMessage: "The funding has been secured on a cost-recovery basis",
    id: "YhPG+C",
    description:
      "Funding secured on a cost-recovery basis operations consideration",
  },
  [OperationsConsideration.UnableCreateNewIndeterminate]: {
    defaultMessage:
      "Unable to create new indeterminate positions in the required timeframe",
    id: "6sjsDa",
    description:
      "Unable to create new indeterminate positions operations consideration",
  },
  [OperationsConsideration.UnableCreateNewTerm]: {
    defaultMessage:
      "Unable to create new term positions in the required timeframe",
    id: "I6TA7y",
    description: "Unable to create new term positions operations consideration",
  },
  [OperationsConsideration.UnableCreateClassificationRestriction]: {
    defaultMessage:
      "Unable to create the position in the required group due to a classification restriction",
    id: "zACLaV",
    description:
      "Unable to create new positions in classification operations consideration",
  },
  [OperationsConsideration.StaffingFreeze]: {
    defaultMessage: "Staffing freeze in place",
    id: "DdTqTh",
    description: "Staffing freeze operations consideration",
  },
  [OperationsConsideration.Other]: formMessages.other,
});

export const getOperationsConsideration = (
  enumKey: keyof typeof operationsConsiderations,
): MessageDescriptor =>
  getOrThrowError(
    operationsConsiderations,
    enumKey,
    `Invalid operations consideration '${enumKey}'`,
  );

export const operationsConsiderationsSortOrder = [
  OperationsConsideration.FinanceVehicleNotUsable,
  OperationsConsideration.FundingSecuredCostRecoveryBasis,
  OperationsConsideration.UnableCreateNewIndeterminate,
  OperationsConsideration.UnableCreateNewTerm,
  OperationsConsideration.UnableCreateClassificationRestriction,
  OperationsConsideration.StaffingFreeze,
  OperationsConsideration.Other,
];

const contractingRationales = defineMessages({
  [ContractingRationale.ShortageOfTalent]: {
    defaultMessage: "Shortage of available or qualified talent",
    id: "xp1dWY",
    description: "Shortage of talent contracting rationale",
  },
  [ContractingRationale.TimingRequirements]: {
    defaultMessage: "Timing requirements",
    id: "m+411R",
    description: "Timing requirements contracting rationale",
  },
  [ContractingRationale.HrSituation]: {
    defaultMessage: "HR situation - available staffing solutions not viable",
    id: "sa8LdD",
    description: "HR situation contracting rationale",
  },
  [ContractingRationale.FinancialSituation]: {
    defaultMessage: "Financial situation - restriction on funding use",
    id: "QCuAwH",
    description: "Financial situation contracting rationale",
  },
  [ContractingRationale.RequiresIndependent]: {
    defaultMessage:
      "Independent, non-GC authority required (e.g., independent service review)",
    id: "n7RwgC",
    description: "Requires independent contracting rationale",
  },
  [ContractingRationale.IntellectualPropertyFactors]: {
    defaultMessage:
      "Intellectual property factors (e.g., proprietary software)",
    id: "LAW/ov",
    description: "Intellectual property factors contracting rationale",
  },
  [ContractingRationale.Other]: formMessages.other,
});

export const getContractingRationale = (
  enumKey: keyof typeof contractingRationales,
): MessageDescriptor =>
  getOrThrowError(
    contractingRationales,
    enumKey,
    `Invalid contracting rationale '${enumKey}'`,
  );

export const contractingRationaleSortOrder = [
  ContractingRationale.ShortageOfTalent,
  ContractingRationale.TimingRequirements,
  ContractingRationale.HrSituation,
  ContractingRationale.FinancialSituation,
  ContractingRationale.RequiresIndependent,
  ContractingRationale.IntellectualPropertyFactors,
  ContractingRationale.Other,
];
