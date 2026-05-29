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
use OpenSpout\Common\Entity\Row;
use OpenSpout\Writer\XLSX\Writer;

class CommunityInterestUserExcelGenerator extends ExcelGenerator implements FileGeneratorInterface
{
    use Filterable;
    use GeneratesFile;

    public function __construct(public string $fileName, public ?string $dir, protected ?string $lang = 'en')
    {
        parent::__construct($fileName, $dir);
    }

    public function generate(): self
    {
        $this->writer = new Writer();
        $this->writer->openToFile($this->getPath());

        $columns = $this->columns();

        $this->writer->addRow(Row::fromValues(
            array_map(fn ($key) => $this->localizeHeading($key), array_keys($columns))
        ));

        $this->buildQuery()->chunk(200, function ($communityInterests) use ($columns) {
            foreach ($communityInterests as $communityInterest) {
                $this->writer->addRow(Row::fromValues(
                    array_map(fn ($fn) => $fn($communityInterest), $columns)
                ));
            }
        });

        $this->writer->close();

        return $this;
    }

    /** @return array<string, callable> */
    private function columns(): array
    {
        return [
            'first_name' => fn ($ci) => $ci->user->first_name,
            'last_name' => fn ($ci) => $ci->user->last_name,

            'armed_forces_status' => fn ($ci) => $this->localizeEnum($ci->user->armed_forces_status, ArmedForcesStatus::class),
            'citizenship' => fn ($ci) => $this->localizeEnum($ci->user->citizenship, CitizenshipStatus::class),

            'interested_in_languages' => fn ($ci) => $this->lookingForLanguages($ci->user),
            'first_official_language' => fn ($ci) => $this->localizeEnum($ci->user->first_official_language, Language::class),
            'second_language_exam_completed' => fn ($ci) => $this->yesOrNo($ci->user->second_language_exam_completed),
            'second_language_exam_validity' => fn ($ci) => $this->yesOrNo($ci->user->second_language_exam_validity),
            'comprehension_level' => fn ($ci) => $this->localizeEnum($ci->user->comprehension_level, EvaluatedLanguageAbility::class),
            'writing_level' => fn ($ci) => $this->localizeEnum($ci->user->written_level, EvaluatedLanguageAbility::class),
            'oral_interaction_level' => fn ($ci) => $this->localizeEnum($ci->user->verbal_level, EvaluatedLanguageAbility::class),
            'estimated_language_ability' => fn ($ci) => $this->localizeEnum($ci->user->estimated_language_ability, EstimatedLanguageAbility::class),

            'government_employee' => fn ($ci) => $this->yesOrNo($ci->user->computed_is_gov_employee),
            'department' => fn ($ci) => $ci->user->department()->first()?->name[$this->lang] ?? '',
            'employee_type' => fn ($ci) => $this->localizeEnum($ci->user->computed_gov_employee_type, GovEmployeeType::class),
            'work_email' => fn ($ci) => $ci->user->work_email,
            'classification' => fn ($ci) => $ci->user->getClassification(),
            'priority_entitlement' => fn ($ci) => $this->yesOrNo($ci->user->has_priority_entitlement),
            'priority_number' => fn ($ci) => $ci->user->priority_number ?? '',

            'accept_temporary' => fn ($ci) => $ci->user->position_duration ? $this->yesOrNo($ci->user->wouldAcceptTemporary()) : '',
            'accepted_operational_requirements' => fn ($ci) => $this->localizeEnumArray($ci->user->getOperationalRequirements()['accepted'], OperationalRequirement::class),
            'location_preferences' => fn ($ci) => $this->localizeEnumArray($ci->user->location_preferences, WorkRegion::class),
            'location_exemptions' => fn ($ci) => $ci->user->location_exemptions,

            'woman' => fn ($ci) => $this->yesOrNo($ci->user->is_woman),
            'indigenous' => fn ($ci) => $this->localizeEnumArray(
                Arr::where($ci->user->indigenous_communities ?? [], fn ($c) => $c !== IndigenousCommunity::LEGACY_IS_INDIGENOUS->name),
                IndigenousCommunity::class
            ),
            'visible_minority' => fn ($ci) => $this->yesOrNo($ci->user->is_visible_minority),
            'disability' => fn ($ci) => $this->yesOrNo($ci->user->has_disability),

            'skills' => fn ($ci) => $ci->user->userSkills
                ->map(fn ($us) => $us->skill->name[$this->lang] ?? '')
                ->join(', '),
        ];
    }

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

    /** @return Builder<CommunityInterest> */
    private function buildQuery(): Builder
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
        $query->authorizedToView(['userId' => $this->authenticatedUserId])
            ->isVerifiedGovEmployee();

        $query->distinct('user_id')->orderBy('user_id');

        return $query;
    }
}
