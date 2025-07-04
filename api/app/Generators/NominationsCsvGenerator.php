<?php

namespace App\Generators;

use App\Enums\ArmedForcesStatus;
use App\Enums\CitizenshipStatus;
use App\Enums\EstimatedLanguageAbility;
use App\Enums\EvaluatedLanguageAbility;
use App\Enums\GovEmployeeType;
use App\Enums\IndigenousCommunity;
use App\Enums\Language;
use App\Enums\OperationalRequirement;
use App\Enums\TalentNominationGroupStatus;
use App\Enums\WorkRegion;
use App\Models\TalentNominationGroup;
use App\Models\User;
use App\Traits\Generator\Filterable;
use App\Traits\Generator\GeneratesFile;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Lang;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

class NominationsCsvGenerator extends CsvGenerator implements FileGeneratorInterface
{
    use Filterable;
    use GeneratesFile;

    protected array $generatedHeaders = [
        'general_questions' => [],
        'screening_questions' => [],
        'skill_details' => [],
    ];

    protected array $headerLocaleKeys = [
        'first_name',
        'last_name',
        'status',
        'date_received',
        'nominators',
        'department',
        'options',
        'armed_forces_status',
        'citizenship',
        'interested_in_languages',
        'first_official_language',
        'second_language_exam_completed',
        'second_language_exam_validity',
        'comprehension_level',
        'writing_level',
        'oral_interaction_level',
        'estimated_language_ability',
        'government_employee',
        'department',
        'employee_type',
        'work_email',
        'classification',
        'priority_entitlement',
        'priority_number',
        'accept_temporary',
        'accepted_operational_requirements',
        'location_preferences',
        'location_exemptions',
        'woman',
        'indigenous',
        'visible_minority',
        'disability',
        'skills',
    ];

    public function __construct(public string $fileName, protected string $talentNominationEventId, public ?string $dir, protected ?string $lang = 'en')
    {
        parent::__construct($fileName, $dir);
    }

    public function generate(): self
    {
        $this->spreadsheet = new Spreadsheet;

        $sheet = $this->spreadsheet->getActiveSheet();
        $localizedHeaders = array_map(function ($key) {
            return $this->localizeHeading($key);
        }, $this->headerLocaleKeys);

        $sheet->fromArray($localizedHeaders, null, 'A1');

        $currentTalentNominationGroup = 1;
        $query = $this->buildQuery();
        $query->chunk(200, function ($talentNominationGroups) use ($sheet, &$currentTalentNominationGroup) {
            foreach ($talentNominationGroups as $talentNominationGroup) {
                $consentToShare = $talentNominationGroup->consentToShareProfile;
                $user = $talentNominationGroup->nominee;
                $nominators = $talentNominationGroup->nominations->map(function ($nomination) {
                    $name = $nomination->nominator_fallback_name;
                    if ($nomination->nominator) {
                        $name = "{$nomination->nominator->first_name} {$nomination->nominator->last_name}";
                    }

                    return $name;
                });

                $options = [];
                if ($talentNominationGroup->advancement_nomination_count > 0) {
                    array_push($options, Lang::get('common.advancement', [], $this->lang));
                }
                if ($talentNominationGroup->lateral_movement_nomination_count > 0) {
                    array_push($options, Lang::get('common.lateral_movement', [], $this->lang));
                }
                if ($talentNominationGroup->development_programs_nomination_count > 0) {
                    array_push($options, Lang::get('common.development', [], $this->lang));
                }
                $options = implode(', ', $options);

                $department = $user->department()->first();
                $preferences = $user->getOperationalRequirements();
                $indigenousCommunities = Arr::where($user->indigenous_communities ?? [], function ($community) {
                    return $community !== IndigenousCommunity::LEGACY_IS_INDIGENOUS->name;
                });
                $userSkills = $user->userSkills->map(function ($userSkill) {
                    return $userSkill->skill->name[$this->lang] ?? '';
                });

                $values = [
                    // Nomination data
                    $user->first_name, // First name
                    $user->last_name, // Last name
                    $this->localizeEnum($talentNominationGroup->status, TalentNominationGroupStatus::class), // Nominee status
                    $talentNominationGroup->created_at ? $talentNominationGroup->created_at->format('Y-m-d') : '', // Date received
                    $nominators->join(', '), // Nominators
                    $department->name[$this->lang] ?? '', // Department
                    $options, // Options

                    // User profile data
                    $this->canShare($consentToShare, $this->canShare($consentToShare, $this->localizeEnum($user->armed_forces_status, ArmedForcesStatus::class))),
                    $this->canShare($consentToShare, $this->localizeEnum($user->citizenship, CitizenshipStatus::class)),
                    $this->canShare($consentToShare, $this->lookingForLanguages($user)),
                    $this->canShare($consentToShare, $this->localizeEnum($user->first_official_language, Language::class)),
                    is_null($user->second_language_exam_completed) ? '' : $this->canShare($consentToShare, $this->yesOrNo($user->second_language_exam_completed)), // Bilingual evaluation
                    $this->canShare($consentToShare, $this->yesOrNo($user->second_language_exam_validity)),
                    $this->canShare($consentToShare, $this->localizeEnum($user->comprehension_level, EvaluatedLanguageAbility::class)), // Reading level
                    $this->canShare($consentToShare, $this->localizeEnum($user->written_level, EvaluatedLanguageAbility::class)), // Writing level
                    $this->canShare($consentToShare, $this->localizeEnum($user->verbal_level, EvaluatedLanguageAbility::class)), // Oral interaction level
                    $this->canShare($consentToShare, $this->localizeEnum($user->estimated_language_ability, EstimatedLanguageAbility::class)),
                    $this->canShare($consentToShare, $this->yesOrNo($user->computed_is_gov_employee)), // Government employee
                    // $this->canShare($consentToShare, $department->name[$this->lang] ?? ''), // Department
                    $this->canShare($consentToShare, $this->localizeEnum($user->computed_gov_employee_type, GovEmployeeType::class)),
                    $this->canShare($consentToShare, $user->work_email), // Work email
                    $this->canShare($consentToShare, $user->getClassification()), // Current classification
                    $this->canShare($consentToShare, $this->yesOrNo($user->has_priority_entitlement)), // Priority entitlement,
                    $this->canShare($consentToShare, $user->priority_number ?? ''), // Priority number
                    $this->canShare($consentToShare, $user->position_duration ? $this->yesOrNo($user->wouldAcceptTemporary()) : ''), // Accept temporary
                    $this->canShare($consentToShare, $this->localizeEnumArray($preferences['accepted'], OperationalRequirement::class)),
                    $this->canShare($consentToShare, $this->localizeEnumArray($user->location_preferences, WorkRegion::class)),
                    $this->canShare($consentToShare, $user->location_exemptions), // Location exemptions
                    $this->canShare($consentToShare, $this->yesOrNo($user->is_woman)), // Woman
                    $this->canShare($consentToShare, $this->localizeEnumArray($indigenousCommunities, IndigenousCommunity::class)),
                    $this->canShare($consentToShare, $this->yesOrNo($user->is_visible_minority)), // Visible minority
                    $this->canShare($consentToShare, $this->yesOrNo($user->has_disability)), // Disability
                    $this->canShare($consentToShare, $userSkills->join(', ')),
                ];

                // 1 is added to the key to account for the header row
                $sheet->fromArray($values, null, sprintf('A%d', $currentTalentNominationGroup + 1));
                $currentTalentNominationGroup++;
            }
        });

        return $this;
    }

    /**
     * Get looking for languages
     */
    private function lookingForLanguages(User $user): string
    {
        $languages = [];

        if ($user->looking_for_english) {
            $languages[] = $this->localize('language.en');
        }

        if ($user->looking_for_french) {
            $languages[] = $this->localize('language.fr');
        }

        if ($user->looking_for_bilingual) {
            $languages[] = $this->localize('common.bilingual');
        }

        return implode(', ', $languages);
    }

    private function buildQuery()
    {
        $query = TalentNominationGroup::with([
            'nominee' => [
                'department',
                'currentClassification',
                'userSkills',
                'userSkills.skill',
            ],
            'nominations' => [
                'nominator',
            ],
        ])->where('talent_nomination_event_id', $this->talentNominationEventId);

        $this->applyFilters($query, []);

        /** @var Builder<TalentNominationGroup> $query */
        $query
            ->authorizedToView(['userId' => $this->userId])
            ->isVerifiedGovEmployee();

        return $query;

    }
}
