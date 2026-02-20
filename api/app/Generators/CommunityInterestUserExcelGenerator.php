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
use App\Enums\WorkRegion;
use App\Models\CommunityInterest;
use App\Models\User;
use App\Traits\Generator\Filterable;
use App\Traits\Generator\GeneratesFile;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

class CommunityInterestUserExcelGenerator extends ExcelGenerator implements FileGeneratorInterface
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

    public function __construct(public string $fileName, public ?string $dir, protected ?string $lang = 'en')
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

        $currentCommunityInterest = 1;
        $query = $this->buildQuery();
        $query->chunk(200, function ($communityInterests) use ($sheet, &$currentCommunityInterest) {
            foreach ($communityInterests as $communityInterest) {

                $user = $communityInterest->user;
                $department = $user->department()->first();
                $preferences = $user->getOperationalRequirements();
                $indigenousCommunities = Arr::where($user->indigenous_communities ?? [], function ($community) {
                    return $community !== IndigenousCommunity::LEGACY_IS_INDIGENOUS->name;
                });
                $userSkills = $user->userSkills->map(function ($userSkill) {
                    return $userSkill->skill->name[$this->lang] ?? '';
                });

                $values = [
                    $user->first_name, // First name
                    $user->last_name, // Last name
                    $this->localizeEnum($user->armed_forces_status, ArmedForcesStatus::class),
                    $this->localizeEnum($user->citizenship, CitizenshipStatus::class),
                    $this->lookingForLanguages($user),
                    $this->localizeEnum($user->first_official_language, Language::class),
                    $this->yesOrNo($user->second_language_exam_completed),
                    $this->yesOrNo($user->second_language_exam_validity),
                    $this->localizeEnum($user->comprehension_level, EvaluatedLanguageAbility::class), // Reading level
                    $this->localizeEnum($user->written_level, EvaluatedLanguageAbility::class), // Writing level
                    $this->localizeEnum($user->verbal_level, EvaluatedLanguageAbility::class), // Oral interaction level
                    $this->localizeEnum($user->estimated_language_ability, EstimatedLanguageAbility::class),
                    $this->yesOrNo($user->computed_is_gov_employee), // Government employee
                    $department->name[$this->lang] ?? '', // Department
                    $this->localizeEnum($user->computed_gov_employee_type, GovEmployeeType::class),
                    $user->work_email, // Work email
                    $user->getClassification(), // Current classification
                    $this->yesOrNo($user->has_priority_entitlement), // Priority entitlement
                    $user->priority_number ?? '', // Priority number
                    $user->position_duration ? $this->yesOrNo($user->wouldAcceptTemporary()) : '', // Accept temporary
                    $this->localizeEnumArray($preferences['accepted'], OperationalRequirement::class),
                    $this->localizeEnumArray($user->location_preferences, WorkRegion::class),
                    $user->location_exemptions, // Location exemptions
                    $this->yesOrNo($user->is_woman), // Woman
                    $this->localizeEnumArray($indigenousCommunities, IndigenousCommunity::class),
                    $this->yesOrNo($user->is_visible_minority), // Visible minority
                    $this->yesOrNo($user->has_disability), // Disability
                    $userSkills->join(', '),
                ];

                // 1 is added to the key to account for the header row
                $sheet->fromArray($values, null, sprintf('A%d', $currentCommunityInterest + 1));
                $currentCommunityInterest++;
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
        $query = CommunityInterest::with([
            'user' => [
                'department',
                'currentClassification',
                'userSkills',
                'userSkills.skill',
            ],
        ]);

        $this->applyFilters($query, []);

        /** @var Builder<CommunityInterest> $query */
        $query
            ->authorizedToView(['userId' => $this->authenticatedUserId])
            ->isVerifiedGovEmployee();

        // Deduplicate community interests (users) in query
        $query->distinct('user_id')->orderBy('user_id');

        return $query;

    }
}
