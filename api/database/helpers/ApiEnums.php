<?php

namespace Database\Helpers;

// TODO: any way to pull these directly from the graphql schema?
class ApiEnums
{
    const OPERATIONAL_REQUIREMENT_SHIFT_WORK = 'SHIFT_WORK';
    const OPERATIONAL_REQUIREMENT_ON_CALL = 'ON_CALL';
    const OPERATIONAL_REQUIREMENT_TRAVEL = 'TRAVEL';
    const OPERATIONAL_REQUIREMENT_TRANSPORT_EQUIPMENT = 'TRANSPORT_EQUIPMENT';
    const OPERATIONAL_REQUIREMENT_DRIVERS_LICENSE = 'DRIVERS_LICENSE';
    const OPERATIONAL_REQUIREMENT_OVERTIME_SCHEDULED = 'OVERTIME_SCHEDULED';
    const OPERATIONAL_REQUIREMENT_OVERTIME_SHORT_NOTICE = 'OVERTIME_SHORT_NOTICE';
    const OPERATIONAL_REQUIREMENT_OVERTIME_OCCASIONAL = 'OVERTIME_OCCASIONAL';
    const OPERATIONAL_REQUIREMENT_OVERTIME_REGULAR = 'OVERTIME_REGULAR';
    /**
     * A collection of enums for operation_requirement in factories and seeders
     *
     * @return string[]
     */
    public static function operationalRequirements(): array
    {
        return [
            self::OPERATIONAL_REQUIREMENT_SHIFT_WORK,
            self::OPERATIONAL_REQUIREMENT_ON_CALL,
            self::OPERATIONAL_REQUIREMENT_TRAVEL,
            self::OPERATIONAL_REQUIREMENT_TRANSPORT_EQUIPMENT,
            self::OPERATIONAL_REQUIREMENT_DRIVERS_LICENSE,
            self::OPERATIONAL_REQUIREMENT_OVERTIME_SCHEDULED,
            self::OPERATIONAL_REQUIREMENT_OVERTIME_SHORT_NOTICE,
            self::OPERATIONAL_REQUIREMENT_OVERTIME_OCCASIONAL,
            self::OPERATIONAL_REQUIREMENT_OVERTIME_REGULAR,
        ];
    }

    const LANGUAGE_ABILITY_ENGLISH = 'ENGLISH';
    const LANGUAGE_ABILITY_FRENCH = 'FRENCH';
    const LANGUAGE_ABILITY_BILINGUAL = 'BILINGUAL';
    /**
     * A collection of enums for LanguageAbility in factories and seeders
     *
     * @return string[]
     */
    public static function languageAbilities(): array
    {
        return [
            self::LANGUAGE_ABILITY_ENGLISH,
            self::LANGUAGE_ABILITY_FRENCH,
            self::LANGUAGE_ABILITY_BILINGUAL,
        ];
    }

    const GOV_EMPLOYEE_TYPE_STUDENT = 'STUDENT';
    const GOV_EMPLOYEE_TYPE_CASUAL = 'CASUAL';
    const GOV_EMPLOYEE_TYPE_TERM = 'TERM';
    const GOV_EMPLOYEE_TYPE_INDETERMINATE = 'INDETERMINATE';
    /**
     * A collection of enums for LanguageAbility in factories and seeders
     *
     * @return string[]
     */
    public static function govEmployeeTypes(): array
    {
        return [
            self::GOV_EMPLOYEE_TYPE_STUDENT,
            self::GOV_EMPLOYEE_TYPE_CASUAL,
            self::GOV_EMPLOYEE_TYPE_TERM,
            self::GOV_EMPLOYEE_TYPE_INDETERMINATE,
        ];
    }

    const CANDIDATE_EXPIRY_FILTER_ACTIVE = 'ACTIVE';
    const CANDIDATE_EXPIRY_FILTER_EXPIRED = 'EXPIRED';
    const CANDIDATE_EXPIRY_FILTER_ALL = 'ALL';
    /**
     * A collection of enums for CandidateExpiryStatus in factories and seeders
     *
     * @return string[]
     */
    public static function candidateExpiryFilters(): array
    {
        return [
            self::CANDIDATE_EXPIRY_FILTER_ACTIVE,
            self::CANDIDATE_EXPIRY_FILTER_EXPIRED,
            self::CANDIDATE_EXPIRY_FILTER_ALL,
        ];
    }

    const CANDIDATE_SUSPENDED_FILTER_ACTIVE = 'ACTIVE';
    const CANDIDATE_SUSPENDED_FILTER_SUSPENDED = 'SUSPENDED';
    const CANDIDATE_SUSPENDED_FILTER_ALL = 'ALL';
    /**
     * A collection of enums for CandidateSuspendedFilter
     * @return string[]
     */
    public static function candidateSuspendedFilters(): array
    {
        return [
            self::CANDIDATE_SUSPENDED_FILTER_ACTIVE,
            self::CANDIDATE_SUSPENDED_FILTER_SUSPENDED,
            self::CANDIDATE_SUSPENDED_FILTER_ALL,
        ];
    }

    // IMPORTANT
    // THE FOLLOWING ENUMS ARE DISTINCT FROM TEAMS ROLES AND EXIST TO MAINTAIN MIGRATION REVERSAL
    // THEY ARE NOT TO BE USED GOING FORWARD, SUPPLANTED BY LEGACY ROLES
    const ROLE_ADMIN = 'ADMIN';
    const ROLE_APPLICANT = 'APPLICANT';
    /**
     *
     * @return string[]
     */
    public static function roles(): array
    {
        return [
            self::ROLE_ADMIN,
            self::ROLE_APPLICANT,
        ];
    }

    /**
     * A collection of enums for salary ranges in factories and seeders
     *
     * @return string[]
     */
    public static function salaryRanges(): array
    {
        return [
            '_50_59K',
            '_60_69K',
            '_70_79K',
            '_80_89K',
            '_90_99K',
            '_100K_PLUS',
        ];
    }

    const CANDIDATE_STATUS_DRAFT = 'DRAFT';
    const CANDIDATE_STATUS_DRAFT_EXPIRED = 'DRAFT_EXPIRED';
    const CANDIDATE_STATUS_NEW_APPLICATION = 'NEW_APPLICATION';
    const CANDIDATE_STATUS_APPLICATION_REVIEW = 'APPLICATION_REVIEW';
    const CANDIDATE_STATUS_SCREENED_IN = 'SCREENED_IN';
    const CANDIDATE_STATUS_SCREENED_OUT_APPLICATION = 'SCREENED_OUT_APPLICATION';
    const CANDIDATE_STATUS_UNDER_ASSESSMENT = 'UNDER_ASSESSMENT';
    const CANDIDATE_STATUS_SCREENED_OUT_ASSESSMENT = 'SCREENED_OUT_ASSESSMENT';
    const CANDIDATE_STATUS_QUALIFIED_AVAILABLE = 'QUALIFIED_AVAILABLE';
    const CANDIDATE_STATUS_QUALIFIED_UNAVAILABLE = 'QUALIFIED_UNAVAILABLE';
    const CANDIDATE_STATUS_QUALIFIED_WITHDREW = 'QUALIFIED_WITHDREW';
    const CANDIDATE_STATUS_PLACED_CASUAL = 'PLACED_CASUAL';
    const CANDIDATE_STATUS_PLACED_TERM = 'PLACED_TERM';
    const CANDIDATE_STATUS_PLACED_INDETERMINATE = 'PLACED_INDETERMINATE';
    const CANDIDATE_STATUS_EXPIRED = 'EXPIRED';
    const CANDIDATE_STATUS_REMOVED = 'REMOVED';

    public static function candidateStatuses(): array
    {
        return [
            self::CANDIDATE_STATUS_DRAFT,
            self::CANDIDATE_STATUS_DRAFT_EXPIRED,
            self::CANDIDATE_STATUS_NEW_APPLICATION,
            self::CANDIDATE_STATUS_APPLICATION_REVIEW,
            self::CANDIDATE_STATUS_SCREENED_IN,
            self::CANDIDATE_STATUS_SCREENED_OUT_APPLICATION,
            self::CANDIDATE_STATUS_UNDER_ASSESSMENT,
            self::CANDIDATE_STATUS_SCREENED_OUT_ASSESSMENT,
            self::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            self::CANDIDATE_STATUS_QUALIFIED_UNAVAILABLE,
            self::CANDIDATE_STATUS_QUALIFIED_WITHDREW,
            self::CANDIDATE_STATUS_PLACED_CASUAL,
            self::CANDIDATE_STATUS_PLACED_TERM,
            self::CANDIDATE_STATUS_PLACED_INDETERMINATE,
            self::CANDIDATE_STATUS_EXPIRED,
            self::CANDIDATE_STATUS_REMOVED,
        ];
    }

    const USER_STATUS_ACTIVELY_LOOKING = 'ACTIVELY_LOOKING';
    const USER_STATUS_OPEN_TO_OPPORTUNITIES = 'OPEN_TO_OPPORTUNITIES';
    const USER_STATUS_INACTIVE = 'INACTIVE';

    /**
     * A collection of enums for user statuses in factories and seeders
     *
     * @return string[]
     */
    public static function userStatuses(): array
    {
        return [
            self::USER_STATUS_ACTIVELY_LOOKING,
            self::USER_STATUS_OPEN_TO_OPPORTUNITIES,
            self::USER_STATUS_INACTIVE
        ];
    }

    const POOL_STATUS_NOT_TAKING_APPLICATIONS = 'NOT_TAKING_APPLICATIONS';
    const POOL_STATUS_TAKING_APPLICATIONS = 'TAKING_APPLICATIONS';

    /**
     * A collection of enums for pool statuses in factories and seeders
     *
     * @return string[]
     */
    public static function oldPoolStatuses(): array
    {
        return [
            self::POOL_STATUS_NOT_TAKING_APPLICATIONS,
            self::POOL_STATUS_TAKING_APPLICATIONS,
        ];
    }

    const GENERIC_JOB_TITLE_KEY_TECHNICIAN_IT01 = 'TECHNICIAN_IT01';
    const GENERIC_JOB_TITLE_KEY_ANALYST_IT02 = 'ANALYST_IT02';
    const GENERIC_JOB_TITLE_KEY_TEAM_LEADER_IT03 = 'TEAM_LEADER_IT03';
    const GENERIC_JOB_TITLE_KEY_TECHNICAL_ADVISOR_IT03 = 'TECHNICAL_ADVISOR_IT03';
    const GENERIC_JOB_TITLE_KEY_SENIOR_ADVISOR_IT04 = 'SENIOR_ADVISOR_IT04';
    const GENERIC_JOB_TITLE_KEY_MANAGER_IT04 = 'MANAGER_IT04';
    /**
     * A collection of enums for GenericJobTitles in factories and seeders
     *
     * @return string[]
     */
    public static function genericJobTitleKeys(): array
    {
        return [
            self::GENERIC_JOB_TITLE_KEY_TECHNICIAN_IT01,
            self::GENERIC_JOB_TITLE_KEY_ANALYST_IT02,
            self::GENERIC_JOB_TITLE_KEY_TEAM_LEADER_IT03,
            self::GENERIC_JOB_TITLE_KEY_TECHNICAL_ADVISOR_IT03,
            self::GENERIC_JOB_TITLE_KEY_SENIOR_ADVISOR_IT04,
            self::GENERIC_JOB_TITLE_KEY_MANAGER_IT04,
        ];
    }

    const WORK_REGION_TELEWORK = 'TELEWORK';
    const WORK_REGION_NATIONAL_CAPITAL = 'NATIONAL_CAPITAL';
    const WORK_REGION_ATLANTIC = 'ATLANTIC';
    const WORK_REGION_QUEBEC = 'QUEBEC';
    const WORK_REGION_ONTARIO = 'ONTARIO';
    const WORK_REGION_PRAIRIE = 'PRAIRIE';
    const WORK_REGION_BRITISH_COLUMBIA = 'BRITISH_COLUMBIA';
    const WORK_REGION_NORTH = 'NORTH';
    /**
     * A collection of enums for WorkRegions in factories and seeders
     *
     * @return string[]
     */
    public static function workRegions(): array
    {
        return [
            self::WORK_REGION_TELEWORK,
            self::WORK_REGION_NATIONAL_CAPITAL,
            self::WORK_REGION_ATLANTIC,
            self::WORK_REGION_QUEBEC,
            self::WORK_REGION_ONTARIO,
            self::WORK_REGION_PRAIRIE,
            self::WORK_REGION_BRITISH_COLUMBIA,
            self::WORK_REGION_NORTH,
        ];
    }

    /**
     * Pool statuses
     */
    const POOL_IS_DRAFT = 'DRAFT';
    const POOL_IS_PUBLISHED = 'PUBLISHED';
    const POOL_IS_CLOSED = 'CLOSED';
    public static function poolStatuses(): array
    {
        return [
            self::POOL_IS_DRAFT,
            self::POOL_IS_PUBLISHED,
            self::POOL_IS_CLOSED,
        ];
    }

    /**
     * Pool languages
     */
    const POOL_ENGLISH = 'ENGLISH';
    const POOL_FRENCH = 'FRENCH';
    const POOL_VARIOUS = 'VARIOUS';
    const POOL_BILINGUAL_INTERMEDIATE = 'BILINGUAL_INTERMEDIATE';
    const POOL_BILINGUAL_ADVANCED = 'BILINGUAL_ADVANCED';
    public static function poolLanguages(): array
    {
        return [
            self::POOL_ENGLISH,
            self::POOL_FRENCH,
            self::POOL_VARIOUS,
            self::POOL_BILINGUAL_INTERMEDIATE,
            self::POOL_BILINGUAL_ADVANCED,
        ];
    }

    /**
     * Pool security clearances
     */
    const POOL_RELIABILITY = 'RELIABILITY';
    const POOL_SECRET = 'SECRET';
    const POOL_TOP_SECRET = 'TOP_SECRET';
    public static function poolSecurity(): array
    {
        return [
            self::POOL_RELIABILITY,
            self::POOL_SECRET,
            self::POOL_TOP_SECRET,
        ];
    }

    /**
     * Pool streams
     */
    const POOL_STREAM_BUSINESS_ADVISORY_SERVICES = 'BUSINESS_ADVISORY_SERVICES';
    const POOL_STREAM_DATABASE_MANAGEMENT = 'DATABASE_MANAGEMENT';
    const POOL_STREAM_ENTERPRISE_ARCHITECTURE = 'ENTERPRISE_ARCHITECTURE';
    const POOL_STREAM_INFRASTRUCTURE_OPERATIONS = 'INFRASTRUCTURE_OPERATIONS';
    const POOL_STREAM_PLANNING_AND_REPORTING = 'PLANNING_AND_REPORTING';
    const POOL_STREAM_PROJECT_PORTFOLIO_MANAGEMENT = 'PROJECT_PORTFOLIO_MANAGEMENT';
    const POOL_STREAM_SECURITY = 'SECURITY';
    const POOL_STREAM_SOFTWARE_SOLUTIONS = 'SOFTWARE_SOLUTIONS';
    const POOL_STREAM_INFORMATION_DATA_FUNCTIONS = 'INFORMATION_DATA_FUNCTIONS';

    public static function poolStreams(): array
    {
        return [
            self::POOL_STREAM_BUSINESS_ADVISORY_SERVICES,
            self::POOL_STREAM_DATABASE_MANAGEMENT,
            self::POOL_STREAM_ENTERPRISE_ARCHITECTURE,
            self::POOL_STREAM_INFRASTRUCTURE_OPERATIONS,
            self::POOL_STREAM_PLANNING_AND_REPORTING,
            self::POOL_STREAM_PROJECT_PORTFOLIO_MANAGEMENT,
            self::POOL_STREAM_SECURITY,
            self::POOL_STREAM_SOFTWARE_SOLUTIONS,
            self::POOL_STREAM_INFORMATION_DATA_FUNCTIONS,
        ];
    }

    /**
     * Citizenship
     */
    const CITIZENSHIP_CITIZEN = 'CITIZEN';
    const CITIZENSHIP_PR = 'PERMANENT_RESIDENT';
    const CITIZENSHIP_OTHER = 'OTHER';
    public static function citizenshipStatuses(): array
    {
        return [
            self::CITIZENSHIP_CITIZEN,
            self::CITIZENSHIP_PR,
            self::CITIZENSHIP_OTHER,
        ];
    }

    /**
     * CAF Status
     */
    const ARMED_FORCES_VETERAN = 'VETERAN';
    const ARMED_FORCES_MEMBER = 'MEMBER';
    const ARMED_FORCES_NON_CAF = 'NON_CAF';
    public static function armedForcesStatuses(): array
    {
        return [
            self::ARMED_FORCES_VETERAN,
            self::ARMED_FORCES_MEMBER,
            self::ARMED_FORCES_NON_CAF,
        ];
    }

    /**
     * Publishing Groups
     */
    const PUBLISHING_GROUP_IAP = 'IAP';
    const PUBLISHING_GROUP_IT_JOBS = 'IT_JOBS';
    const PUBLISHING_GROUP_IT_JOBS_ONGOING = 'IT_JOBS_ONGOING';
    const PUBLISHING_GROUP_EXECUTIVE_JOBS = 'EXECUTIVE_JOBS';
    const PUBLISHING_GROUP_OTHER = 'OTHER';

    public static function publishingGroups(): array
    {
        return [
            self::PUBLISHING_GROUP_IAP,
            self::PUBLISHING_GROUP_IT_JOBS,
            self::PUBLISHING_GROUP_IT_JOBS_ONGOING,
            self::PUBLISHING_GROUP_EXECUTIVE_JOBS,
            self::PUBLISHING_GROUP_OTHER,
        ];
    }

    /**
     * Pool Application Errors
     */
    const POOL_CANDIDATE_EXISTS = 'APPLICATION_EXISTS';
    const POOL_CANDIDATE_POOL_NOT_PUBLISHED = 'POOL_NOT_PUBLISHED';
    const POOL_CANDIDATE_POOL_CLOSED = 'POOL_CLOSED';
    const POOL_CANDIDATE_PROFILE_INCOMPLETE = 'PROFILE_INCOMPLETE';
    const POOL_CANDIDATE_MISSING_ESSENTIAL_SKILLS = 'MISSING_ESSENTIAL_SKILLS';
    const POOL_CANDIDATE_MISSING_LANGUAGE_REQUIREMENTS = 'MISSING_LANGUAGE_REQUIREMENTS';
    const POOL_CANDIDATE_MISSING_QUESTION_RESPONSE = 'MISSING_QUESTION_RESPONSE';
    const POOL_CANDIDATE_SIGNATURE_REQUIRED = 'SIGNATURE_REQUIRED';
    const POOL_CANDIDATE_EDUCATION_REQUIREMENT_INCOMPLETE = 'EDUCATION_REQUIREMENT_INCOMPLETE';

    public static function poolCandidateErrors(): array
    {
        return [
            self::POOL_CANDIDATE_EXISTS,
            self::POOL_CANDIDATE_POOL_NOT_PUBLISHED,
            self::POOL_CANDIDATE_POOL_CLOSED,
            self::POOL_CANDIDATE_PROFILE_INCOMPLETE,
            self::POOL_CANDIDATE_MISSING_ESSENTIAL_SKILLS,
            self::POOL_CANDIDATE_MISSING_LANGUAGE_REQUIREMENTS,
            self::POOL_CANDIDATE_MISSING_QUESTION_RESPONSE,
            self::POOL_CANDIDATE_SIGNATURE_REQUIRED,
            self::POOL_CANDIDATE_EDUCATION_REQUIREMENT_INCOMPLETE,
        ];
    }


    /**
     * Pool Candidate Request Statuses
     */
    const POOL_CANDIDATE_SEARCH_STATUS_NEW = 'NEW';
    const POOL_CANDIDATE_SEARCH_STATUS_IN_PROGRESS = 'IN_PROGRESS';
    const POOL_CANDIDATE_SEARCH_STATUS_WAITING = 'WAITING';
    const POOL_CANDIDATE_SEARCH_STATUS_DONE = 'DONE';

    public static function poolCandidateSearchStatuses(): array
    {
        return [
            self::POOL_CANDIDATE_SEARCH_STATUS_NEW,
            self::POOL_CANDIDATE_SEARCH_STATUS_IN_PROGRESS,
            self::POOL_CANDIDATE_SEARCH_STATUS_WAITING,
            self::POOL_CANDIDATE_SEARCH_STATUS_DONE,
        ];
    }

    /**
     * Position Duration
     */
    const POSITION_DURATION_TEMPORARY = 'TEMPORARY';
    const POSITION_DURATION_PERMANENT = 'PERMANENT';

    public static function positionDurations(): array
    {
        return [
            self::POSITION_DURATION_TEMPORARY,
            self::POSITION_DURATION_PERMANENT,
        ];
    }

    /**
     * Indigenous Communities
     */
    const INDIGENOUS_STATUS_FIRST_NATIONS = 'STATUS_FIRST_NATIONS';
    const INDIGENOUS_NON_STATUS_FIRST_NATIONS = 'NON_STATUS_FIRST_NATIONS';
    const INDIGENOUS_INUIT = 'INUIT';
    const INDIGENOUS_METIS = 'METIS';
    const INDIGENOUS_OTHER = 'OTHER';
    const INDIGENOUS_LEGACY_IS_INDIGENOUS = 'LEGACY_IS_INDIGENOUS';

    public static function indigenousCommunities(): array
    {
        return [
            self::INDIGENOUS_STATUS_FIRST_NATIONS,
            self::INDIGENOUS_NON_STATUS_FIRST_NATIONS,
            self::INDIGENOUS_INUIT,
            self::INDIGENOUS_METIS,
            self::INDIGENOUS_OTHER,
            self::INDIGENOUS_LEGACY_IS_INDIGENOUS,
        ];
    }

    /**
     * Skill Category
     */
    const SKILL_CATEGORY_TECHNICAL = 'TECHNICAL';
    const SKILL_CATEGORY_BEHAVIOURAL = 'BEHAVIOURAL';

    public static function skillCategories(): array
    {
        return [
            self::SKILL_CATEGORY_TECHNICAL,
            self::SKILL_CATEGORY_BEHAVIOURAL,
        ];
    }

    /**
     * The steps in the job application flow
     */
    const APPLICATION_STEP_WELCOME = 'WELCOME';
    const APPLICATION_STEP_SELF_DECLARATION = 'SELF_DECLARATION';
    const APPLICATION_STEP_REVIEW_YOUR_PROFILE = 'REVIEW_YOUR_PROFILE';
    const APPLICATION_STEP_REVIEW_YOUR_RESUME = 'REVIEW_YOUR_RESUME';
    const APPLICATION_STEP_EDUCATION_REQUIREMENTS = 'EDUCATION_REQUIREMENTS';
    const APPLICATION_STEP_SKILL_REQUIREMENTS = 'SKILL_REQUIREMENTS';
    const APPLICATION_STEP_SCREENING_QUESTIONS = 'SCREENING_QUESTIONS';
    const APPLICATION_STEP_REVIEW_AND_SUBMIT = 'REVIEW_AND_SUBMIT';

    public static function applicationSteps(): array
    {
        return [
            self::APPLICATION_STEP_WELCOME,
            self::APPLICATION_STEP_SELF_DECLARATION,
            self::APPLICATION_STEP_REVIEW_YOUR_PROFILE,
            self::APPLICATION_STEP_REVIEW_YOUR_RESUME,
            self::APPLICATION_STEP_EDUCATION_REQUIREMENTS,
            self::APPLICATION_STEP_SKILL_REQUIREMENTS,
            self::APPLICATION_STEP_SCREENING_QUESTIONS,
            self::APPLICATION_STEP_REVIEW_AND_SUBMIT,
        ];
    }

    const EDUCATION_REQUIREMENT_OPTION_APPLIED_WORK = 'APPLIED_WORK';
    const EDUCATION_REQUIREMENT_OPTION_EDUCATION = 'EDUCATION';

    /**
     * A collection of enums for application criteria
     *
     * @return string[]
     */
    public static function poolCandidateCriteria(): array
    {
        return [
            self::EDUCATION_REQUIREMENT_OPTION_APPLIED_WORK,
            self::EDUCATION_REQUIREMENT_OPTION_EDUCATION,
        ];
    }
}
