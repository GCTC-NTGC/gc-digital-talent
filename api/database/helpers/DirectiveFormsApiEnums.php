<?php

namespace Database\Helpers;

class DirectiveFormsApiEnums
{
    const CONTRACT_AUTHORITY_HR = 'HR';

    const CONTRACT_AUTHORITY_PROCUREMENT = 'PROCUREMENT';

    const CONTRACT_AUTHORITY_FINANCE = 'FINANCE';

    const CONTRACT_AUTHORITY_LABOUR_RELATIONS = 'LABOUR_RELATIONS';

    const CONTRACT_AUTHORITY_OTHER = 'OTHER';

    /**
     * A collection of enums for ContractAuthority in factories and seeders
     *
     * @return string[]
     */
    public static function contractAuthorities(): array
    {
        return [
            self::CONTRACT_AUTHORITY_HR,
            self::CONTRACT_AUTHORITY_PROCUREMENT,
            self::CONTRACT_AUTHORITY_FINANCE,
            self::CONTRACT_AUTHORITY_LABOUR_RELATIONS,
            self::CONTRACT_AUTHORITY_OTHER,
        ];
    }

    const YESNO_YES = 'YES';

    const YESNO_NO = 'NO';

    /**
     * A collection of enums for YesNo in factories and seeders
     *
     * @return string[]
     */
    public static function yesNo(): array
    {
        return [
            self::YESNO_YES,
            self::YESNO_NO,
        ];
    }

    const YESNOUNSURE_YES = 'YES';

    const YESNOUNSURE_NO = 'NO';

    const YESNOUNSURE_I_DONT_KNOW = 'I_DONT_KNOW';

    /**
     * A collection of enums for YesNoUnsure in factories and seeders
     *
     * @return string[]
     */
    public static function yesNoUnsure(): array
    {
        return [
            self::YESNOUNSURE_YES,
            self::YESNOUNSURE_NO,
            self::YESNOUNSURE_I_DONT_KNOW,
        ];
    }

    const CONTRACT_VALUE_RANGE_FROM_0_TO_10K = 'FROM_0_TO_10K';

    const CONTRACT_VALUE_RANGE_FROM_10K_TO_25K = 'FROM_10K_TO_25K';

    const CONTRACT_VALUE_RANGE_FROM_25K_TO_50K = 'FROM_25K_TO_50K';

    const CONTRACT_VALUE_RANGE_FROM_50K_TO_1M = 'FROM_50K_TO_1M';

    const CONTRACT_VALUE_RANGE_FROM_1M_TO_2500K = 'FROM_1M_TO_2500K';

    const CONTRACT_VALUE_RANGE_FROM_2500K_TO_5M = 'FROM_2500K_TO_5M';

    const CONTRACT_VALUE_RANGE_FROM_5M_TO_10M = 'FROM_5M_TO_10M';

    const CONTRACT_VALUE_RANGE_FROM_10M_TO_15M = 'FROM_10M_TO_15M';

    const CONTRACT_VALUE_RANGE_FROM_15M_TO_25M = 'FROM_15M_TO_25M';

    const CONTRACT_VALUE_RANGE_GREATER_THAN_25M = 'GREATER_THAN_25M';

    /**
     * A collection of enums for ContractValueRange in factories and seeders
     *
     * @return string[]
     */
    public static function contractValueRanges(): array
    {
        return [
            self::CONTRACT_VALUE_RANGE_FROM_0_TO_10K,
            self::CONTRACT_VALUE_RANGE_FROM_10K_TO_25K,
            self::CONTRACT_VALUE_RANGE_FROM_25K_TO_50K,
            self::CONTRACT_VALUE_RANGE_FROM_50K_TO_1M,
            self::CONTRACT_VALUE_RANGE_FROM_1M_TO_2500K,
            self::CONTRACT_VALUE_RANGE_FROM_2500K_TO_5M,
            self::CONTRACT_VALUE_RANGE_FROM_5M_TO_10M,
            self::CONTRACT_VALUE_RANGE_FROM_10M_TO_15M,
            self::CONTRACT_VALUE_RANGE_FROM_15M_TO_25M,
            self::CONTRACT_VALUE_RANGE_GREATER_THAN_25M,
        ];
    }

    const CONTRACT_START_TIMEFRAME_FROM_0_TO_3M = 'FROM_0_TO_3M';

    const CONTRACT_START_TIMEFRAME_FROM_3M_TO_6M = 'FROM_3M_TO_6M';

    const CONTRACT_START_TIMEFRAME_FROM_6M_TO_1Y = 'FROM_6M_TO_1Y';

    const CONTRACT_START_TIMEFRAME_FROM_1Y_TO_2Y = 'FROM_1Y_TO_2Y';

    const CONTRACT_START_TIMEFRAME_UNKNOWN = 'UNKNOWN';

    const CONTRACT_START_TIMEFRAME_VARIABLE = 'VARIABLE';

    /**
     * A collection of enums for ContractStartTimeframe in factories and seeders
     *
     * @return string[]
     */
    public static function contractStartTimeframes(): array
    {
        return [
            self::CONTRACT_START_TIMEFRAME_FROM_0_TO_3M,
            self::CONTRACT_START_TIMEFRAME_FROM_3M_TO_6M,
            self::CONTRACT_START_TIMEFRAME_FROM_6M_TO_1Y,
            self::CONTRACT_START_TIMEFRAME_FROM_1Y_TO_2Y,
            self::CONTRACT_START_TIMEFRAME_UNKNOWN,
            self::CONTRACT_START_TIMEFRAME_VARIABLE,
        ];
    }

    const CONTRACT_COMMODITY_TELECOM_SERVICES = 'TELECOM_SERVICES';

    const CONTRACT_COMMODITY_SUPPORT_SERVICES = 'SUPPORT_SERVICES';

    const CONTRACT_COMMODITY_OTHER = 'OTHER';

    /**
     * A collection of enums for ContractCommodity in factories and seeders
     *
     * @return string[]
     */
    public static function contractCommodities(): array
    {
        return [
            self::CONTRACT_COMMODITY_TELECOM_SERVICES,
            self::CONTRACT_COMMODITY_SUPPORT_SERVICES,
            self::CONTRACT_COMMODITY_OTHER,
        ];
    }

    const CONTRACT_INSTRUMENT_SUPPLY_ARRANGEMENT = 'SUPPLY_ARRANGEMENT';

    const CONTRACT_INSTRUMENT_STANDING_OFFER = 'STANDING_OFFER';

    const CONTRACT_INSTRUMENT_CONTRACT = 'CONTRACT';

    const CONTRACT_INSTRUMENT_AMENDMENT = 'AMENDMENT';

    /**
     * A collection of enums for ContractInstrument in factories and seeders
     *
     * @return string[]
     */
    public static function contractInstruments(): array
    {
        return [
            self::CONTRACT_INSTRUMENT_SUPPLY_ARRANGEMENT,
            self::CONTRACT_INSTRUMENT_STANDING_OFFER,
            self::CONTRACT_INSTRUMENT_CONTRACT,
            self::CONTRACT_INSTRUMENT_AMENDMENT,
        ];
    }

    const CONTRACT_SUPPLY_METHOD_NOT_APPLICABLE = 'NOT_APPLICABLE';

    const CONTRACT_SUPPLY_METHOD_SOLUTIONS_BASED_INFORMATICS_PROFESSIONAL_SERVICES = 'SOLUTIONS_BASED_INFORMATICS_PROFESSIONAL_SERVICES';

    const CONTRACT_SUPPLY_METHOD_TASK_BASED_INFORMATICS_PROFESSIONAL_SERVICES = 'TASK_BASED_INFORMATICS_PROFESSIONAL_SERVICES';

    const CONTRACT_SUPPLY_METHOD_TEMPORARY_HELP = 'TEMPORARY_HELP';

    const CONTRACT_SUPPLY_METHOD_OTHER = 'OTHER';

    /**
     * A collection of enums for ContractSupplyMethod in factories and seeders
     *
     * @return string[]
     */
    public static function contractSupplyMethods(): array
    {
        return [
            self::CONTRACT_SUPPLY_METHOD_NOT_APPLICABLE,
            self::CONTRACT_SUPPLY_METHOD_SOLUTIONS_BASED_INFORMATICS_PROFESSIONAL_SERVICES,
            self::CONTRACT_SUPPLY_METHOD_TASK_BASED_INFORMATICS_PROFESSIONAL_SERVICES,
            self::CONTRACT_SUPPLY_METHOD_TEMPORARY_HELP,
            self::CONTRACT_SUPPLY_METHOD_OTHER,
        ];
    }

    const CONTRACT_SOLICITATION_PROCEDURE_ADVANCE_CONTRACT_AWARD_NOTICE = 'ADVANCE_CONTRACT_AWARD_NOTICE';

    const CONTRACT_SOLICITATION_PROCEDURE_COMPETITIVE = 'COMPETITIVE';

    const CONTRACT_SOLICITATION_PROCEDURE_NON_COMPETITIVE = 'NON_COMPETITIVE';

    /**
     * A collection of enums for ContractSolicitationProcedure in factories and seeders
     *
     * @return string[]
     */
    public static function contractSolicitationProcedures(): array
    {
        return [
            self::CONTRACT_SOLICITATION_PROCEDURE_ADVANCE_CONTRACT_AWARD_NOTICE,
            self::CONTRACT_SOLICITATION_PROCEDURE_COMPETITIVE,
            self::CONTRACT_SOLICITATION_PROCEDURE_NON_COMPETITIVE,
        ];
    }

    const PERSONNEL_SCREENING_LEVEL_RELIABILITY = 'RELIABILITY';

    const PERSONNEL_SCREENING_LEVEL_ENHANCED_RELIABILITY = 'ENHANCED_RELIABILITY';

    const PERSONNEL_SCREENING_LEVEL_SECRET = 'SECRET';

    const PERSONNEL_SCREENING_LEVEL_TOP_SECRET = 'TOP_SECRET';

    const PERSONNEL_SCREENING_LEVEL_OTHER = 'OTHER';

    /**
     * A collection of enums for PersonnelScreeningLevel in factories and seeders
     *
     * @return string[]
     */
    public static function personnelScreeningLevels(): array
    {
        return [
            self::PERSONNEL_SCREENING_LEVEL_RELIABILITY,
            self::PERSONNEL_SCREENING_LEVEL_ENHANCED_RELIABILITY,
            self::PERSONNEL_SCREENING_LEVEL_SECRET,
            self::PERSONNEL_SCREENING_LEVEL_TOP_SECRET,
            self::PERSONNEL_SCREENING_LEVEL_OTHER,
        ];
    }

    const PERSONNEL_LANGUAGE_ENGLISH_ONLY = 'ENGLISH_ONLY';

    const PERSONNEL_LANGUAGE_FRENCH_ONLY = 'FRENCH_ONLY';

    const PERSONNEL_LANGUAGE_BILINGUAL_INTERMEDIATE = 'BILINGUAL_INTERMEDIATE';

    const PERSONNEL_LANGUAGE_BILINGUAL_ADVANCED = 'BILINGUAL_ADVANCED';

    const PERSONNEL_LANGUAGE_OTHER = 'OTHER';

    /**
     * A collection of enums for PersonnelLanguage in factories and seeders
     *
     * @return string[]
     */
    public static function personnelLanguages(): array
    {
        return [
            self::PERSONNEL_LANGUAGE_ENGLISH_ONLY,
            self::PERSONNEL_LANGUAGE_FRENCH_ONLY,
            self::PERSONNEL_LANGUAGE_BILINGUAL_INTERMEDIATE,
            self::PERSONNEL_LANGUAGE_BILINGUAL_ADVANCED,
            self::PERSONNEL_LANGUAGE_OTHER,
        ];
    }

    const PERSONNEL_WORK_LOCATION_GC_PREMISES = 'GC_PREMISES';

    const PERSONNEL_WORK_LOCATION_OFFSITE_SPECIFIC = 'OFFSITE_SPECIFIC';

    const PERSONNEL_WORK_LOCATION_OFFSITE_ANY = 'OFFSITE_ANY';

    /**
     * A collection of enums for PersonnelWorkLocation in factories and seeders
     *
     * @return string[]
     */
    public static function personnelWorkLocations(): array
    {
        return [
            self::PERSONNEL_WORK_LOCATION_GC_PREMISES,
            self::PERSONNEL_WORK_LOCATION_OFFSITE_SPECIFIC,
            self::PERSONNEL_WORK_LOCATION_OFFSITE_ANY,
        ];
    }

    const PERSONNEL_OTHER_REQUIREMENT_SHIFT_WORK = 'SHIFT_WORK';

    const PERSONNEL_OTHER_REQUIREMENT_ON_CALL_24_7 = 'ON_CALL_24_7';

    const PERSONNEL_OTHER_REQUIREMENT_OVERTIME_SHORT_NOTICE = 'OVERTIME_SHORT_NOTICE';

    const PERSONNEL_OTHER_REQUIREMENT_AS_NEEDED = 'AS_NEEDED';

    const PERSONNEL_OTHER_REQUIREMENT_OTHER = 'OTHER';

    /**
     * A collection of enums for PersonnelOtherRequirements in factories and seeders
     *
     * @return string[]
     */
    public static function personnelOtherRequirements(): array
    {
        return [
            self::PERSONNEL_OTHER_REQUIREMENT_SHIFT_WORK,
            self::PERSONNEL_OTHER_REQUIREMENT_ON_CALL_24_7,
            self::PERSONNEL_OTHER_REQUIREMENT_OVERTIME_SHORT_NOTICE,
            self::PERSONNEL_OTHER_REQUIREMENT_AS_NEEDED,
            self::PERSONNEL_OTHER_REQUIREMENT_OTHER,
        ];
    }

    const OPERATIONS_CONSIDERATION_FINANCE_VEHICLE_NOT_USABLE = 'FINANCE_VEHICLE_NOT_USABLE';

    const OPERATIONS_CONSIDERATION_FUNDING_SECURED_COST_RECOVERY_BASIS = 'FUNDING_SECURED_COST_RECOVERY_BASIS';

    const OPERATIONS_CONSIDERATION_UNABLE_CREATE_NEW_INDETERMINATE = 'UNABLE_CREATE_NEW_INDETERMINATE';

    const OPERATIONS_CONSIDERATION_UNABLE_CREATE_NEW_TERM = 'UNABLE_CREATE_NEW_TERM';

    const OPERATIONS_CONSIDERATION_UNABLE_CREATE_CLASSIFICATION_RESTRICTION = 'UNABLE_CREATE_CLASSIFICATION_RESTRICTION';

    const OPERATIONS_CONSIDERATION_STAFFING_FREEZE = 'STAFFING_FREEZE';

    const OPERATIONS_CONSIDERATION_OTHER = 'OTHER';

    /**
     * A collection of enums for OperationsConsideration in factories and seeders
     *
     * @return string[]
     */
    public static function operationsConsiderations(): array
    {
        return [
            self::OPERATIONS_CONSIDERATION_FINANCE_VEHICLE_NOT_USABLE,
            self::OPERATIONS_CONSIDERATION_FUNDING_SECURED_COST_RECOVERY_BASIS,
            self::OPERATIONS_CONSIDERATION_UNABLE_CREATE_NEW_INDETERMINATE,
            self::OPERATIONS_CONSIDERATION_UNABLE_CREATE_NEW_TERM,
            self::OPERATIONS_CONSIDERATION_UNABLE_CREATE_CLASSIFICATION_RESTRICTION,
            self::OPERATIONS_CONSIDERATION_STAFFING_FREEZE,
            self::OPERATIONS_CONSIDERATION_OTHER,
        ];
    }

    const CONTRACTING_RATIONALE_SHORTAGE_OF_TALENT = 'SHORTAGE_OF_TALENT';

    const CONTRACTING_RATIONALE_TIMING_REQUIREMENTS = 'TIMING_REQUIREMENTS';

    const CONTRACTING_RATIONALE_HR_SITUATION = 'HR_SITUATION';

    const CONTRACTING_RATIONALE_FINANCIAL_SITUATION = 'FINANCIAL_SITUATION';

    const CONTRACTING_RATIONALE_REQUIRES_INDEPENDENT = 'REQUIRES_INDEPENDENT';

    const CONTRACTING_RATIONALE_INTELLECTUAL_PROPERTY_FACTORS = 'INTELLECTUAL_PROPERTY_FACTORS';

    const CONTRACTING_RATIONALE_OTHER = 'OTHER';

    /**
     * A collection of enums for ContractingRationale in factories and seeders
     *
     * @return string[]
     */
    public static function contractingRationales(): array
    {
        return [
            self::CONTRACTING_RATIONALE_SHORTAGE_OF_TALENT,
            self::CONTRACTING_RATIONALE_TIMING_REQUIREMENTS,
            self::CONTRACTING_RATIONALE_HR_SITUATION,
            self::CONTRACTING_RATIONALE_FINANCIAL_SITUATION,
            self::CONTRACTING_RATIONALE_REQUIRES_INDEPENDENT,
            self::CONTRACTING_RATIONALE_INTELLECTUAL_PROPERTY_FACTORS,
            self::CONTRACTING_RATIONALE_OTHER,
        ];
    }

    const PERSONNEL_TELEWORK_OPTION_FULL_TIME = 'FULL_TIME';

    const PERSONNEL_TELEWORK_OPTION_PART_TIME = 'PART_TIME';

    const PERSONNEL_TELEWORK_OPTION_NO = 'NO';

    /**
     * A collection of enums for PersonnelTeleworkOption in factories and seeders
     *
     * @return string[]
     */
    public static function personnelTeleworkOptions(): array
    {
        return [
            self::PERSONNEL_TELEWORK_OPTION_FULL_TIME,
            self::PERSONNEL_TELEWORK_OPTION_PART_TIME,
            self::PERSONNEL_TELEWORK_OPTION_NO,
        ];
    }

    const PERSONNEL_SKILL_EXPERTISE_LEVEL_BEGINNER = 'BEGINNER';

    const PERSONNEL_SKILL_EXPERTISE_LEVEL_INTERMEDIATE = 'INTERMEDIATE';

    const PERSONNEL_SKILL_EXPERTISE_LEVEL_EXPERT = 'EXPERT';

    const PERSONNEL_SKILL_EXPERTISE_LEVEL_LEAD = 'LEAD';

    /**
     * A collection of enums for PersonnelSkillExpertiseLevel in factories and seeders
     *
     * @return string[]
     */
    public static function personnelSkillExpertiseLevels(): array
    {
        return [
            self::PERSONNEL_SKILL_EXPERTISE_LEVEL_BEGINNER,
            self::PERSONNEL_SKILL_EXPERTISE_LEVEL_INTERMEDIATE,
            self::PERSONNEL_SKILL_EXPERTISE_LEVEL_EXPERT,
            self::PERSONNEL_SKILL_EXPERTISE_LEVEL_LEAD,
        ];
    }

    const POSITION_EMPLOYMENT_TYPE_INDETERMINATE = 'INDETERMINATE';

    const POSITION_EMPLOYMENT_TYPE_TERM = 'TERM';

    const POSITION_EMPLOYMENT_TYPE_LATERAL_DEPLOYMENT = 'LATERAL_DEPLOYMENT';

    const POSITION_EMPLOYMENT_TYPE_SECONDMENT = 'SECONDMENT';

    const POSITION_EMPLOYMENT_TYPE_ASSIGNMENT = 'ASSIGNMENT';

    const POSITION_EMPLOYMENT_TYPE_OTHER = 'OTHER';

    /**
     * A collection of enums for PositionEmploymentType in factories and seeders
     *
     * @return string[]
     */
    public static function positionEmploymentTypes(): array
    {
        return [
            self::POSITION_EMPLOYMENT_TYPE_INDETERMINATE,
            self::POSITION_EMPLOYMENT_TYPE_TERM,
            self::POSITION_EMPLOYMENT_TYPE_LATERAL_DEPLOYMENT,
            self::POSITION_EMPLOYMENT_TYPE_SECONDMENT,
            self::POSITION_EMPLOYMENT_TYPE_ASSIGNMENT,
            self::POSITION_EMPLOYMENT_TYPE_OTHER,
        ];
    }

    const ADVERTISEMENT_TYPE_INTERNAL = 'INTERNAL';

    const ADVERTISEMENT_TYPE_EXTERNAL = 'EXTERNAL';

    /**
     * A collection of enums for AdvertisementType in factories and seeders
     *
     * @return string[]
     */
    public static function advertisementTypes(): array
    {
        return [
            self::ADVERTISEMENT_TYPE_INTERNAL,
            self::ADVERTISEMENT_TYPE_EXTERNAL,
        ];
    }

    const ADVERTISING_PLATFORM_GCJOBS = 'GCJOBS';

    const ADVERTISING_PLATFORM_GCCONNEX = 'GCCONNEX';

    const ADVERTISING_PLATFORM_GCXCHNAGE = 'GCXCHNAGE';

    const ADVERTISING_PLATFORM_GC_COLLAB = 'GC_COLLAB';

    const ADVERTISING_PLATFORM_FACEBOOK = 'FACEBOOK';

    const ADVERTISING_PLATFORM_LINKEDIN = 'LINKEDIN';

    const ADVERTISING_PLATFORM_OTHER = 'OTHER';

    /**
     * A collection of enums for AdvertisingPlatform in factories and seeders
     *
     * @return string[]
     */
    public static function advertisingPlatforms(): array
    {
        return [
            self::ADVERTISING_PLATFORM_GCJOBS,
            self::ADVERTISING_PLATFORM_GCCONNEX,
            self::ADVERTISING_PLATFORM_GCXCHNAGE,
            self::ADVERTISING_PLATFORM_GC_COLLAB,
            self::ADVERTISING_PLATFORM_FACEBOOK,
            self::ADVERTISING_PLATFORM_LINKEDIN,
            self::ADVERTISING_PLATFORM_OTHER,
        ];
    }
}
