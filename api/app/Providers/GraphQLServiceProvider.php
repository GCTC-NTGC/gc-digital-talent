<?php

namespace App\Providers;

use App\Enums\ApplicationStep;
use App\Enums\ArmedForcesStatus;
use App\Enums\AssessmentDecision;
use App\Enums\AssessmentDecisionLevel;
use App\Enums\AssessmentResultJustification;
use App\Enums\AssessmentResultType;
use App\Enums\AssessmentStepType;
use App\Enums\AwardedScope;
use App\Enums\AwardedTo;
use App\Enums\CandidateExpiryFilter;
use App\Enums\CandidateRemovalReason;
use App\Enums\CandidateSuspendedFilter;
use App\Enums\CitizenshipStatus;
use App\Enums\ClaimVerificationResult;
use App\Enums\DirectiveForms\AdvertisementType;
use App\Enums\DirectiveForms\AdvertisingPlatform;
use App\Enums\DirectiveForms\ContractAuthority;
use App\Enums\DirectiveForms\ContractCommodity;
use App\Enums\DirectiveForms\ContractFteRange;
use App\Enums\DirectiveForms\ContractingRationale;
use App\Enums\DirectiveForms\ContractInstrument;
use App\Enums\DirectiveForms\ContractSolicitationProcedure;
use App\Enums\DirectiveForms\ContractStartTimeframe;
use App\Enums\DirectiveForms\ContractSupplyMethod;
use App\Enums\DirectiveForms\ContractValueRange;
use App\Enums\DirectiveForms\OperationsConsideration;
use App\Enums\DirectiveForms\PersonnelLanguage;
use App\Enums\DirectiveForms\PersonnelOtherRequirement;
use App\Enums\DirectiveForms\PersonnelScreeningLevel;
use App\Enums\DirectiveForms\PersonnelSkillExpertiseLevel;
use App\Enums\DirectiveForms\PersonnelTeleworkOption;
use App\Enums\DirectiveForms\PersonnelWorkLocation;
use App\Enums\DirectiveForms\PositionEmploymentType;
use App\Enums\DirectiveForms\YesNo;
use App\Enums\DirectiveForms\YesNoUnsure;
use App\Enums\DisqualificationReason;
use App\Enums\EducationRequirementOption;
use App\Enums\EducationStatus;
use App\Enums\EducationType;
use App\Enums\EstimatedLanguageAbility;
use App\Enums\EvaluatedLanguageAbility;
use App\Enums\GenericJobTitleKey;
use App\Enums\GovEmployeeType;
use App\Enums\IndigenousCommunity;
use App\Enums\Language;
use App\Enums\LanguageAbility;
use App\Enums\NotificationFamily;
use App\Enums\OperationalRequirement;
use App\Enums\OverallAssessmentStatus;
use App\Enums\PlacementType;
use App\Enums\PoolCandidateSearchPositionType;
use App\Enums\PoolCandidateSearchRequestReason;
use App\Enums\PoolCandidateSearchStatus;
use App\Enums\PoolCandidateStatus;
use App\Enums\PoolLanguage;
use App\Enums\PoolOpportunityLength;
use App\Enums\PoolSkillType;
use App\Enums\PoolStatus;
use App\Enums\PoolStream;
use App\Enums\PositionDuration;
use App\Enums\PriorityWeight;
use App\Enums\ProvinceOrTerritory;
use App\Enums\PublishingGroup;
use App\Enums\SecurityStatus;
use App\Enums\SkillCategory;
use App\Enums\SkillLevel;
use App\Enums\WhenSkillUsed;
use App\Enums\WorkRegion;
use App\GraphQL\Operators\PostgreSQLOperator;
use GraphQL\Type\Definition\EnumType;
use Illuminate\Support\ServiceProvider;
use Nuwave\Lighthouse\Schema\TypeRegistry;
use Nuwave\Lighthouse\WhereConditions\Operator;

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
            'ClaimVerificationResult',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'ClaimVerificationResult',
                    'values' => array_column(ClaimVerificationResult::cases(), 'name'),
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
            'PoolSkillType',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'PoolSkillType',
                    'values' => array_column(PoolSkillType::cases(), 'name'),
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
            'DisqualificationReason',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'DisqualificationReason',
                    'values' => array_column(DisqualificationReason::cases(), 'name'),
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
            'PlacementType',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'PlacementType',
                    'values' => array_column(PlacementType::cases(), 'name'),
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
            'PoolOpportunityLength',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'PoolOpportunityLength',
                    'values' => array_column(PoolOpportunityLength::cases(), 'name'),
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
            'PoolCandidateSearchRequestReason',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'PoolCandidateSearchRequestReason',
                    'values' => array_column(PoolCandidateSearchRequestReason::cases(), 'name'),
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

        /*
         * Directive forms
         */
        $typeRegistry->registerLazy(
            'AdvertisementType',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'AdvertisementType',
                    'values' => array_column(AdvertisementType::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'AdvertisingPlatform',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'AdvertisingPlatform',
                    'values' => array_column(AdvertisingPlatform::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'ContractAuthority',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'ContractAuthority',
                    'values' => array_column(ContractAuthority::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'YesNo',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'YesNo',
                    'values' => array_column(YesNo::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'YesNoUnsure',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'YesNoUnsure',
                    'values' => array_column(YesNoUnsure::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'ContractValueRange',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'ContractValueRange',
                    'values' => array_column(ContractValueRange::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'ContractStartTimeframe',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'ContractStartTimeframe',
                    'values' => array_column(ContractStartTimeframe::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'ContractCommodity',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'ContractCommodity',
                    'values' => array_column(ContractCommodity::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'ContractFteRange',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'ContractFteRange',
                    'values' => array_column(ContractFteRange::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'ContractInstrument',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'ContractInstrument',
                    'values' => array_column(ContractInstrument::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'ContractSupplyMethod',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'ContractSupplyMethod',
                    'values' => array_column(ContractSupplyMethod::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'ContractSolicitationProcedure',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'ContractSolicitationProcedure',
                    'values' => array_column(ContractSolicitationProcedure::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'PersonnelScreeningLevel',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'PersonnelScreeningLevel',
                    'values' => array_column(PersonnelScreeningLevel::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'PersonnelLanguage',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'PersonnelLanguage',
                    'values' => array_column(PersonnelLanguage::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'PersonnelWorkLocation',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'PersonnelWorkLocation',
                    'values' => array_column(PersonnelWorkLocation::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'PositionEmploymentType',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'PositionEmploymentType',
                    'values' => array_column(PositionEmploymentType::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'PersonnelOtherRequirement',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'PersonnelOtherRequirement',
                    'values' => array_column(PersonnelOtherRequirement::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'PersonnelSkillExpertiseLevel',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'PersonnelSkillExpertiseLevel',
                    'values' => array_column(PersonnelSkillExpertiseLevel::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'PersonnelTeleworkOption',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'PersonnelTeleworkOption',
                    'values' => array_column(PersonnelTeleworkOption::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'OperationsConsideration',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'OperationsConsideration',
                    'values' => array_column(OperationsConsideration::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'ContractingRationale',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'ContractingRationale',
                    'values' => array_column(ContractingRationale::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'AssessmentStepType',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'AssessmentStepType',
                    'values' => array_column(AssessmentStepType::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'AssessmentResultType',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'AssessmentResultType',
                    'values' => array_column(AssessmentResultType::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'AssessmentDecision',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'AssessmentDecision',
                    'values' => array_column(AssessmentDecision::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'AssessmentResultJustification',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'AssessmentResultJustification',
                    'values' => array_column(AssessmentResultJustification::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'AssessmentDecisionLevel',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'AssessmentDecisionLevel',
                    'values' => array_column(AssessmentDecisionLevel::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'NotificationFamily',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'NotificationFamily',
                    'values' => array_column(NotificationFamily::cases(), 'name'),
                ]);
            }
        );

        $typeRegistry->registerLazy(
            'CandidateRemovalReason',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'CandidateRemovalReason',
                    'values' => array_column(CandidateRemovalReason::cases(), 'name'),
                ]);
            }
        );

        $typeRegistry->registerLazy(
            'PriorityWeight',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'PriorityWeight',
                    'values' => array_column(PriorityWeight::cases(), 'name'),
                ]);
            }
        );

        $typeRegistry->registerLazy(
            'OverallAssessmentStatus',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'OverallAssessmentStatus',
                    'values' => array_column(OverallAssessmentStatus::cases(), 'name'),
                ]);
            }
        );
    }

    public function register(): void
    {
        $this->app->bind(Operator::class, PostgreSQLOperator::class);
    }
}
