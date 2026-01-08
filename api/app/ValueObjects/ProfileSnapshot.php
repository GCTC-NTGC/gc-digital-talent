<?php

namespace App\ValueObjects;

use App\Enums\ArmedForcesStatus;
use App\Enums\CafEmploymentType;
use App\Enums\CafForce;
use App\Enums\CafRank;
use App\Enums\CitizenshipStatus;
use App\Enums\CSuiteRoleTitle;
use App\Enums\EducationRequirementOption;
use App\Enums\EmploymentCategory;
use App\Enums\EstimatedLanguageAbility;
use App\Enums\EvaluatedLanguageAbility;
use App\Enums\ExternalRoleSeniority;
use App\Enums\ExternalSizeOfOrganization;
use App\Enums\FlexibleWorkLocation;
use App\Enums\GovContractorRoleSeniority;
use App\Enums\GovContractorType;
use App\Enums\GovEmployeeType;
use App\Enums\GovPositionType;
use App\Enums\Language;
use App\Enums\OperationalRequirement;
use App\Enums\ProvinceOrTerritory;
use App\Enums\WorkRegion;
use App\Http\Resources\UserResource;
use App\Models\Pool;
use App\Models\User;
use Illuminate\Contracts\Database\Eloquent\Castable;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use RecursiveArrayIterator;

class ProfileSnapshot implements Castable
{
    public static $VERSION = 1;

    public ?array $profile;

    public function __construct(mixed $snapshot)
    {

        if (! $snapshot) {
            $this->profile = null;

            return;
        }

        $snapshot = json_decode($snapshot, true) ?? null;

        if (! $snapshot) {
            $this->profile = null;
        } else {
            $enumMap = [
                'acceptedOperationalRequirements' => OperationalRequirement::class,
                'armedForcesStatus' => ArmedForcesStatus::class,
                'citizenship' => CitizenshipStatus::class,
                'comprehensionLevel' => EvaluatedLanguageAbility::class,
                'currentProvince' => ProvinceOrTerritory::class,
                'educationRequirementOption' => EducationRequirementOption::class,
                'estimatedLanguageAbility' => EstimatedLanguageAbility::class,
                'firstOfficialLanguage' => Language::class,
                'govEmployeeType' => GovEmployeeType::class,
                'locationPreferences' => WorkRegion::class,
                'flexibleWorkLocations' => FlexibleWorkLocation::class,
                'preferredLang' => Language::class,
                'preferredLanguageForInterview' => Language::class,
                'preferredLanguageForExam' => Language::class,
                'verbalLevel' => EvaluatedLanguageAbility::class,
                'writtenLevel' => EvaluatedLanguageAbility::class,
                'employmentCategory' => EmploymentCategory::class,
                'extSizeOfOrganization' => ExternalSizeOfOrganization::class,
                'extRoleSeniority' => ExternalRoleSeniority::class,
                'govEmploymentType' => GovEmployeeType::class,
                'govPositionType' => GovPositionType::class,
                'govContractorRoleSeniority' => GovContractorRoleSeniority::class,
                'govContractorType' => GovContractorType::class,
                'cafEmploymentType' => CafEmploymentType::class,
                'cafForce' => CafForce::class,
                'cafRank' => CafRank::class,
                'cSuiteRoleTitle' => CSuiteRoleTitle::class,
            ];

            $iterator = new RecursiveArrayIterator($snapshot);

            $parsedSnapshot = [];
            $parsedSnapshot = $this->parseSnapshotRecursive($iterator, $parsedSnapshot, $enumMap);

            $this->profile = $parsedSnapshot;
        }
    }

    public static function castUsing(array $args): CastsAttributes
    {
        return new class implements CastsAttributes
        {
            public function get(Model $model, string $key, mixed $value, array $attributes): ?array
            {
                $snapshot = new ProfileSnapshot($value);

                return $snapshot->profile;
            }

            public function set(Model $model, string $key, mixed $value, array $attributes)
            {

                if ($model->getOriginal($key) !== null) {
                    return json_encode($model->getOriginal($key));
                }

                if (is_array($value) && ! array_key_exists('userId', $value) && ! array_key_exists('poolId', $value)) {
                    return json_encode($value);
                }

                $user = User::with([
                    'department',
                    'currentClassification',
                    'userSkills.skill',
                    'awardExperiences',
                    'awardExperiences.skills',
                    'communityExperiences',
                    'communityExperiences.skills',
                    'educationExperiences',
                    'educationExperiences.skills',
                    'personalExperiences',
                    'personalExperiences.skills',
                    'workExperiences',
                    'workExperiences.skills',
                    'workExperiences.workStreams',
                    'offPlatformRecruitmentProcesses',
                    'offPlatformRecruitmentProcesses.classification',
                    'offPlatformRecruitmentProcesses.department',
                ])->findOrFail($value['userId']);

                // collect skills attached to the Pool to pass into resource collection
                /** @var Pool $pool */
                $pool = Pool::with(['poolSkills'])->findOrFail($value['poolId']);
                $poolSkillIds = $pool->poolSkills()->pluck('skill_id')->toArray();

                $profile = new UserResource($user);
                $profile = $profile->poolSkillIds($poolSkillIds);
                $profile->version = ProfileSnapshot::$VERSION;

                return $profile->toJson();
            }
        };
    }

    /**
     * Transform an enum value from the snapshot
     * into a localized enum if it already isn't one.
     */
    private function parseSnapshotEnum(mixed $value, $enum): mixed
    {

        if (method_exists($enum, 'localizedString')) {
            if (is_string($value)) {
                return [
                    'value' => $value,
                    'label' => $enum::localizedString($value),
                ];
            }
        }

        return $value;
    }

    /**
     * Iterate through the snapshot and transform
     * non-localized enum values into their localized
     * version.
     *
     * NOTE: This is to handle legacy snapshots.
     * We can remove this once we are no longer using non-localized
     * enums in the snapshots.
     */
    private function parseSnapshotRecursive(RecursiveArrayIterator $rai, array $accumulator, $enumMap)
    {
        foreach ($rai as $k => $v) {
            if (array_key_exists($k, $enumMap)) {
                $enum = $enumMap[$k];
                if (is_array($v) && array_is_list($v)) {
                    $accumulator[$k] = array_map(function ($item) use ($enum) {
                        return $this->parseSnapshotEnum($item, $enum);
                    }, $v);
                } else {
                    $accumulator[$k] = $this->parseSnapshotEnum($v, $enum);
                }
            } else {
                if ($rai->hasChildren()) {
                    $accumulator[$k] = $this->parseSnapshotRecursive($rai->getChildren(), [], $enumMap);
                } else {
                    $accumulator[$k] = $v;
                }
            }
        }

        return $accumulator;
    }
}
