<?php

namespace App\Providers;

use App\GraphQL\Operators\PostgreSQLOperator;
use Illuminate\Support\ServiceProvider;
use GraphQL\Type\Definition\EnumType;
use Nuwave\Lighthouse\WhereConditions\Operator;
use Nuwave\Lighthouse\Schema\TypeRegistry;

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

enum IndigenousCommunity {
    case STATUS_FIRST_NATIONS;
    case NON_STATUS_FIRST_NATIONS;
    case INUIT;
    case METIS;
    case OTHER;
    case LEGACY_IS_INDIGENOUS;
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
                    ]
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
    }

    public function register(): void
    {
        $this->app->bind(Operator::class, PostgreSQLOperator::class);
    }
}
