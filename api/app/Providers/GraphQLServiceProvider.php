<?php

namespace App\Providers;

use App\GraphQL\Operators\PostgreSQLOperator;
use GraphQL\Type\Definition\Description;
use GraphQL\Type\Definition\EnumType;
use Illuminate\Support\ServiceProvider;
use Nuwave\Lighthouse\Schema\TypeRegistry;
use Nuwave\Lighthouse\WhereConditions\Operator;

enum Language: string
{
    case EN = 'en';
    case FR = 'fr';
}

enum ProvinceOrTerritory
{
    case BRITISH_COLUMBIA;
    case ALBERTA;
    case SASKATCHEWAN;
    case MANITOBA;
    case ONTARIO;
    case QUEBEC;
    case NEW_BRUNSWICK;
    case NOVA_SCOTIA;
    case PRINCE_EDWARD_ISLAND;
    case NEWFOUNDLAND_AND_LABRADOR;
    case YUKON;
    case NORTHWEST_TERRITORIES;
    case NUNAVUT;
}

enum GovEmployeeType
{
    case STUDENT;
    case CASUAL;
    case TERM;
    case INDETERMINATE;
}

enum BilingualEvaluation
{
    case COMPLETED_ENGLISH;
    case COMPLETED_FRENCH;
    case NOT_COMPLETED;
}

enum EvaluatedLanguageAbility
{
    case X;
    case A;
    case B;
    case C;
    case E;
    case P;
}

enum EstimatedLanguageAbility
{
    case BEGINNER;
    case INTERMEDIATE;
    case ADVANCED;
}

enum CitizenshipStatus
{
    case PERMANENT_RESIDENT;
    case CITIZEN;
    case OTHER;
}

enum ArmedForcesStatus
{
    case VETERAN;
    case MEMBER;
    case NON_CAF;
}

enum PositionDuration
{
    case TEMPORARY;
    case PERMANENT;
}

enum PoolStream
{
    case ACCESS_INFORMATION_PRIVACY;
    case BUSINESS_ADVISORY_SERVICES;
    case DATABASE_MANAGEMENT;
    case ENTERPRISE_ARCHITECTURE;
    case INFRASTRUCTURE_OPERATIONS;
    case PLANNING_AND_REPORTING;
    case PROJECT_PORTFOLIO_MANAGEMENT;
    case SECURITY;
    case SOFTWARE_SOLUTIONS;
    case INFORMATION_DATA_FUNCTIONS;
}

enum PoolStatus
{
    case DRAFT;
    case PUBLISHED;
    case CLOSED;
    case ARCHIVED;
}

enum PoolCandidateStatus
{
    case DRAFT;
    case DRAFT_EXPIRED;
    case NEW_APPLICATION;
    case APPLICATION_REVIEW;
    case SCREENED_IN;
    case SCREENED_OUT_APPLICATION;
    case SCREENED_OUT_NOT_INTERESTED;
    case SCREENED_OUT_NOT_RESPONSIVE;
    case UNDER_ASSESSMENT;
    case SCREENED_OUT_ASSESSMENT;
    case QUALIFIED_AVAILABLE;
    case QUALIFIED_UNAVAILABLE;
    case QUALIFIED_WITHDREW;
    case PLACED_CASUAL;
    case PLACED_TERM;
    case PLACED_INDETERMINATE;
    case EXPIRED;
    case REMOVED;
}

enum IndigenousCommunity
{
    case STATUS_FIRST_NATIONS;
    case NON_STATUS_FIRST_NATIONS;
    case INUIT;
    case METIS;
    case OTHER;
    case LEGACY_IS_INDIGENOUS;
}

enum SecurityStatus
{
    case RELIABILITY;
    case SECRET;
    case TOP_SECRET;
}

enum PoolLanguage
{
    case ENGLISH;
    case FRENCH;
    case VARIOUS;
    case BILINGUAL_INTERMEDIATE;
    case BILINGUAL_ADVANCED;
}

enum PublishingGroup
{
    case IAP;
    case IT_JOBS;
    case IT_JOBS_ONGOING;
    case EXECUTIVE_JOBS;
    case OTHER;
}

enum ApplicationStep
{
    case WELCOME;
    case SELF_DECLARATION;
    case REVIEW_YOUR_PROFILE;
    #[Description(description: 'This is the career timeline.')]
    case REVIEW_YOUR_RESUME;
    case EDUCATION_REQUIREMENTS;
    case SKILL_REQUIREMENTS;
    case SCREENING_QUESTIONS;
    case REVIEW_AND_SUBMIT;
}

enum EducationRequirementOption
{
    case APPLIED_WORK;
    case EDUCATION;
}

enum LanguageAbility
{
    case ENGLISH;
    case FRENCH;
    case BILINGUAL;
}

enum WorkRegion
{
    case TELEWORK;
    case NATIONAL_CAPITAL;
    case ATLANTIC;
    case QUEBEC;
    case ONTARIO;
    case PRAIRIE;
    case BRITISH_COLUMBIA;
    case NORTH;
}

#[Description(description: 'e.g. Overtime as Required, Shift Work, Travel as Required, etc.')]
enum OperationalRequirement
{
    case SHIFT_WORK;
    case ON_CALL;
    case TRAVEL;
    case TRANSPORT_EQUIPMENT;
    case DRIVERS_LICENSE;
    case OVERTIME_SCHEDULED;
    case OVERTIME_SHORT_NOTICE;
    case OVERTIME_OCCASIONAL;
    case OVERTIME_REGULAR;
}

enum SalaryRange
{
    case _50_59K;
    case _60_69K;
    case _70_79K;
    case _80_89K;
    case _90_99K;
    case _100K_PLUS;
}

enum GenericJobTitleKey
{
    case TECHNICIAN_IT01;
    case ANALYST_IT02;
    case TEAM_LEADER_IT03;
    case TECHNICAL_ADVISOR_IT03;
    case SENIOR_ADVISOR_IT04;
    case MANAGER_IT04;
}

enum PoolCandidateSearchStatus
{
    case NEW;
    case IN_PROGRESS;
    case WAITING;
    case DONE;
}

enum PoolCandidateSearchPositionType
{
    case INDIVIDUAL_CONTRIBUTOR;
    case TEAM_LEAD;
}

enum SkillCategory
{
    case TECHNICAL;
    case BEHAVIOURAL;
}

enum SkillLevel
{
    case BEGINNER;
    case INTERMEDIATE;
    case ADVANCED;
    case LEAD;
}

enum WhenSkillUsed
{
    case CURRENT;
    case PAST;
}

enum AwardedTo
{
    case ME;
    case MY_TEAM;
    case MY_PROJECT;
    case MY_ORGANIZATION;
}

enum AwardedScope
{
    case INTERNATIONAL;
    case NATIONAL;
    case PROVINCIAL;
    case LOCAL;
    case COMMUNITY;
    case ORGANIZATIONAL;
    case SUB_ORGANIZATIONAL;
}

enum EducationType
{
    case DIPLOMA;
    case BACHELORS_DEGREE;
    case MASTERS_DEGREE;
    case PHD;
    case POST_DOCTORAL_FELLOWSHIP;
    case ONLINE_COURSE;
    case CERTIFICATION;
    case OTHER;
}

enum EducationStatus
{
    case SUCCESS_CREDENTIAL;
    case SUCCESS_NO_CREDENTIAL;
    case IN_PROGRESS;
    case AUDITED;
    case DID_NOT_COMPLETE;
}

enum CandidateExpiryFilter
{
    case ACTIVE;
    case EXPIRED;
    case ALL;
}

enum CandidateSuspendedFilter
{
    case ACTIVE;
    case SUSPENDED;
    case ALL;
}

class GraphQLServiceProvider extends ServiceProvider
{
    public function boot(TypeRegistry $typeRegistry): void
    {
        $typeRegistry->registerLazy(
            'Language',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'Language',
                    'values' => [
                        Language::EN->name => ['value' => Language::EN->value],
                        Language::FR->name => ['value' => Language::FR->value],
                    ],
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'ProvinceOrTerritory',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'ProvinceOrTerritory',
                    'values' => array_column(ProvinceOrTerritory::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'GovEmployeeType',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'GovEmployeeType',
                    'values' => array_column(GovEmployeeType::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'BilingualEvaluation',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'BilingualEvaluation',
                    'values' => array_column(BilingualEvaluation::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'EvaluatedLanguageAbility',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'EvaluatedLanguageAbility',
                    'values' => array_column(EvaluatedLanguageAbility::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'EstimatedLanguageAbility',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'EstimatedLanguageAbility',
                    'values' => array_column(EstimatedLanguageAbility::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'CitizenshipStatus',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'CitizenshipStatus',
                    'values' => array_column(CitizenshipStatus::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'ArmedForcesStatus',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'ArmedForcesStatus',
                    'values' => array_column(ArmedForcesStatus::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'PositionDuration',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'PositionDuration',
                    'values' => array_column(PositionDuration::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'IndigenousCommunity',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'IndigenousCommunity',
                    'values' => array_column(IndigenousCommunity::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'PoolStream',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'PoolStream',
                    'values' => array_column(PoolStream::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'PoolStatus',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'PoolStatus',
                    'values' => array_column(PoolStatus::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'PoolCandidateStatus',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'PoolCandidateStatus',
                    'values' => array_column(PoolCandidateStatus::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'SecurityStatus',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'SecurityStatus',
                    'values' => array_column(SecurityStatus::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'PoolLanguage',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'PoolLanguage',
                    'values' => array_column(PoolLanguage::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'PublishingGroup',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'PublishingGroup',
                    'values' => array_column(PublishingGroup::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'ApplicationStep',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'ApplicationStep',
                    'values' => array_column(ApplicationStep::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'EducationRequirementOption',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'EducationRequirementOption',
                    'values' => array_column(EducationRequirementOption::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'LanguageAbility',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'LanguageAbility',
                    'values' => array_column(LanguageAbility::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'WorkRegion',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'WorkRegion',
                    'values' => array_column(WorkRegion::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'OperationalRequirement',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'OperationalRequirement',
                    'values' => array_column(OperationalRequirement::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'SalaryRange',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'SalaryRange',
                    'values' => array_column(SalaryRange::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'GenericJobTitleKey',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'GenericJobTitleKey',
                    'values' => array_column(GenericJobTitleKey::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'PoolCandidateSearchStatus',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'PoolCandidateSearchStatus',
                    'values' => array_column(PoolCandidateSearchStatus::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'PoolCandidateSearchPositionType',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'PoolCandidateSearchPositionType',
                    'values' => array_column(PoolCandidateSearchPositionType::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'SkillCategory',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'SkillCategory',
                    'values' => array_column(SkillCategory::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'SkillLevel',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'SkillLevel',
                    'values' => array_column(SkillLevel::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'WhenSkillUsed',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'WhenSkillUsed',
                    'values' => array_column(WhenSkillUsed::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'AwardedTo',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'AwardedTo',
                    'values' => array_column(AwardedTo::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'AwardedScope',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'AwardedScope',
                    'values' => array_column(AwardedScope::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'EducationType',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'EducationType',
                    'values' => array_column(EducationType::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'EducationStatus',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'EducationStatus',
                    'values' => array_column(EducationStatus::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'CandidateExpiryFilter',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'CandidateExpiryFilter',
                    'values' => array_column(CandidateExpiryFilter::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'CandidateSuspendedFilter',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'CandidateSuspendedFilter',
                    'values' => array_column(CandidateSuspendedFilter::cases(), 'name'),
                ]);
            }
        );
    }

    public function register(): void
    {
        $this->app->bind(Operator::class, PostgreSQLOperator::class);
    }
}
