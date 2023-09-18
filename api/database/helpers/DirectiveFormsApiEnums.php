<?php

namespace Database\Helpers;

class DirectiveFormsApiEnums
{
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
}
