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
use App\Enums\TalentNominationGroupDecision;
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

class NominationsExcelGenerator extends ExcelGenerator implements FileGeneratorInterface
{
    use Filterable;
    use GeneratesFile;

    protected array $generatedHeaders = [
        'general_questions' => [],
        'screening_questions' => [],
        'skill_details' => [],
    ];

    protected array $overviewLocaleKeys = [
        'user_id',
        'first_name',
        'last_name',
        'status',
        'nominators',
        'nomination_options',
        'advancement_approval',
        'advancement_approval_notes',
        'lateral_movement_approval',
        'lateral_movement_approval_notes',
        'development_program_approval',
        'development_program_approval_notes',
    ];

    protected array $userProfileHeaderKeys = [
        'id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'armed_forces_status',
        'citizenship',
        'current_city',
        'current_province',
        'preferred_communication_language',
        'interested_in_languages',
        'first_official_language',
        'estimated_language_ability',
        'second_language_exam_completed',
        'second_language_exam_validity',
        'comprehension_level',
        'writing_level',
        'oral_interaction_level',
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
        'flexible_work_locations',
        'location_exemptions',
        'woman',
        'indigenous',
        'visible_minority',
        'disability',
        'skills',
        'career_planning_lateral_move_interest',
        'career_planning_lateral_move_time_frame',
        'career_planning_lateral_move_organization_type',
        'career_planning_promotion_move_interest',
        'career_planning_promotion_move_time_frame',
        'career_planning_promotion_move_organization_type',
        'career_planning_learning_opportunities_interest',
        'eligible_retirement_year',
        'career_planning_mentorship_status',
        'career_planning_mentorship_interest',
        'career_planning_exec_interest',
        'career_planning_exec_coaching_status',
        'career_planning_exec_coaching_interest',
        'next_role_target_classification_group',
        'next_role_target_classification_level',
        'next_role_target_role',
        'next_role_is_c_suite_role',
        'next_role_c_suite_role_title',
        'next_role_job_title',
        'next_role_functional_community',
        'next_role_work_streams',
        'next_role_departments',
        'next_role_additional_information',
        'career_objective_target_classification_group',
        'career_objective_target_classification_level',
        'career_objective_target_role',
        'career_objective_is_c_suite_role',
        'career_objective_c_suite_role_title',
        'career_objective_job_title',
        'career_objective_functional_community',
        'career_objective_work_streams',
        'career_objective_departments',
        'career_objective_additional_information',
        'career_planning_about_you',
        'career_planning_learning_goals',
        'career_planning_work_style',
        'digital_talent_processes',
        'off_platform_processes_not_verified',
    ];

    protected array $nominationDetailsHeaderKeys = [
        'nominee_user_id',
        'nominee_first_name',
        'nominee_last_name',
        'nomination_date',
        'nomination_options',
        'nominator',
        'relationship_to_nominee',
        'nominator_email',
        'nominator_classification',
        'nominator_department',
        'submitters_name',
        'submitters_email',
        'submitters_relationship_to_nominee',
        'reference_name',
        'reference_email',
        'reference_classification',
        'reference_department',
        'lateral_experience_recommendations',
        'other_lateral_experience',
        'development_program_recommendations',
        'other_development_program_experience',
        'rationale',
        'leadership_competencies',
        'additional_comments',
    ];

    public function __construct(public string $fileName, protected string $talentNominationEventId, public ?string $dir, protected ?string $lang = 'en')
    {
        parent::__construct($fileName, $dir);
    }

    public function generate(): self
    {
        $this->spreadsheet = new Spreadsheet;

        // Nominations overview sheet
        $overviewSheet = $this->spreadsheet->getActiveSheet();
        $overviewSheet->setTitle(Lang::get('headings.nominations_overview', [], $this->lang));

        // Nominee Profiles sheet
        $nomineeProfilesSheet = $this->spreadsheet->createSheet();
        $nomineeProfilesSheet->setTitle(Lang::get('headings.nominee_profiles', [], $this->lang));

        // Nomination Details sheet
        $nominationDetailsSheet = $this->spreadsheet->createSheet();
        $nominationDetailsSheet->setTitle(Lang::get('headings.nominations_details', [], $this->lang));

        // Generate data for sheets
        $this->generateOverviewTab($overviewSheet);
        $this->generateNomineeProfilesTab($nomineeProfilesSheet);
        $this->generateNominationDetailsTab($nominationDetailsSheet);

        return $this;
    }

    /**
     * Generate the overview tab
     */
    private function generateOverviewTab($sheet): void
    {
        $localizedHeaders = array_map(function ($key) {
            return $this->localizeHeading($key);
        }, $this->overviewLocaleKeys);

        $sheet->fromArray($localizedHeaders, null, 'A1');
        $row = 2;
        $query = $this->buildQuery();
        $query->chunk(200, function ($talentNominationGroups) use ($sheet, &$row) {
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

                // Build nomination options with counts in parentheses
                $options = [];
                if ($talentNominationGroup->advancement_nomination_count > 0) {
                    $options[] = sprintf(
                        '%s (%d)',
                        $this->localize('common.advancement'),
                        $talentNominationGroup->advancement_nomination_count
                    );
                }
                if ($talentNominationGroup->lateral_movement_nomination_count > 0) {
                    $options[] = sprintf(
                        '%s (%d)',
                        $this->localize('common.lateral_movement'),
                        $talentNominationGroup->lateral_movement_nomination_count
                    );
                }
                if ($talentNominationGroup->development_programs_nomination_count > 0) {
                    $options[] = sprintf(
                        '%s (%d)',
                        $this->localize('common.development'),
                        $talentNominationGroup->development_programs_nomination_count
                    );
                }
                $optionsStr = implode(', ', $options);

                $values = [
                    $user->id,
                    $this->canShare($consentToShare, $user->first_name),
                    $this->canShare($consentToShare, $user->last_name),
                    $this->localizeEnum($talentNominationGroup->status, TalentNominationGroupStatus::class),
                    $nominators->join(', '),
                    $optionsStr,
                    $this->localizeEnum($talentNominationGroup->advancement_decision, TalentNominationGroupDecision::class),
                    $this->canShare($consentToShare, $talentNominationGroup->advancement_notes ?? ''),
                    $this->localizeEnum($talentNominationGroup->lateral_movement_decision, TalentNominationGroupDecision::class),
                    $this->canShare($consentToShare, $talentNominationGroup->lateral_movement_notes ?? ''),
                    $this->localizeEnum($talentNominationGroup->development_programs_decision, TalentNominationGroupDecision::class),
                    $this->canShare($consentToShare, $talentNominationGroup->development_programs_notes ?? ''),
                ];

                $sheet->fromArray($values, null, sprintf('A%d', $row));
                $row++;
            }
        });
    }

    /**
     * Generate the nominee profiles tab
     */
    private function generateNomineeProfilesTab($sheet): void
    {
        $localizedHeaders = array_map(function ($key) {
            return $this->localizeHeading($key);
        }, $this->userProfileHeaderKeys);

        $sheet->fromArray($localizedHeaders, null, 'A1');
    }

    /**
     * Generate the nomination details tab
     * */
    private function generateNominationDetailsTab($sheet): void
    {
        $localizedHeaders = array_map(function ($key) {
            return $this->localizeHeading($key);
        }, $this->nominationDetailsHeaderKeys);

        $sheet->fromArray($localizedHeaders, null, 'A1');
    }

    // public function generate(): self
    // {
    //     $this->spreadsheet = new Spreadsheet;

    //     $sheet = $this->spreadsheet->getActiveSheet();
    //     $localizedHeaders = array_map(function ($key) {
    //         return $this->localizeHeading($key);
    //     }, $this->overviewLocaleKeys);

    //     $sheet->fromArray($localizedHeaders, null, 'A1');

    //     $currentTalentNominationGroup = 1;
    //     $query = $this->buildQuery();
    //     $query->chunk(200, function ($talentNominationGroups) use ($sheet, &$currentTalentNominationGroup) {
    //         foreach ($talentNominationGroups as $talentNominationGroup) {
    //             $consentToShare = $talentNominationGroup->consentToShareProfile;
    //             $user = $talentNominationGroup->nominee;
    //             $nominators = $talentNominationGroup->nominations->map(function ($nomination) {
    //                 $name = $nomination->nominator_fallback_name;
    //                 if ($nomination->nominator) {
    //                     $name = "{$nomination->nominator->first_name} {$nomination->nominator->last_name}";
    //                 }

    //                 return $name;
    //             });

    //             $options = [];
    //             if ($talentNominationGroup->advancement_nomination_count > 0) {
    //                 array_push($options, Lang::get('common.advancement', [], $this->lang));
    //             }
    //             if ($talentNominationGroup->lateral_movement_nomination_count > 0) {
    //                 array_push($options, Lang::get('common.lateral_movement', [], $this->lang));
    //             }
    //             if ($talentNominationGroup->development_programs_nomination_count > 0) {
    //                 array_push($options, Lang::get('common.development', [], $this->lang));
    //             }
    //             $options = implode(', ', $options);

    //             $department = $user->department()->first();
    //             $preferences = $user->getOperationalRequirements();
    //             $indigenousCommunities = Arr::where($user->indigenous_communities ?? [], function ($community) {
    //                 return $community !== IndigenousCommunity::LEGACY_IS_INDIGENOUS->name;
    //             });
    //             $userSkills = $user->userSkills->map(function ($userSkill) {
    //                 return $userSkill->skill->name[$this->lang] ?? '';
    //             });

    //             $values = [
    //                 // Nomination data
    //                 $user->first_name, // First name
    //                 $user->last_name, // Last name
    //                 $this->localizeEnum($talentNominationGroup->status, TalentNominationGroupStatus::class), // Nominee status
    //                 $talentNominationGroup->created_at ? $talentNominationGroup->created_at->format('Y-m-d') : '', // Date received
    //                 $nominators->join(', '), // Nominators
    //                 $department->name[$this->lang] ?? '', // Department
    //                 $options, // Options

    //                 // User profile data
    //                 $this->canShare($consentToShare, $this->canShare($consentToShare, $this->localizeEnum($user->armed_forces_status, ArmedForcesStatus::class))),
    //                 $this->canShare($consentToShare, $this->localizeEnum($user->citizenship, CitizenshipStatus::class)),
    //                 $this->canShare($consentToShare, $this->lookingForLanguages($user)),
    //                 $this->canShare($consentToShare, $this->localizeEnum($user->first_official_language, Language::class)),
    //                 is_null($user->second_language_exam_completed) ? '' : $this->canShare($consentToShare, $this->yesOrNo($user->second_language_exam_completed)), // Bilingual evaluation
    //                 $this->canShare($consentToShare, $this->yesOrNo($user->second_language_exam_validity)),
    //                 $this->canShare($consentToShare, $this->localizeEnum($user->comprehension_level, EvaluatedLanguageAbility::class)), // Reading level
    //                 $this->canShare($consentToShare, $this->localizeEnum($user->written_level, EvaluatedLanguageAbility::class)), // Writing level
    //                 $this->canShare($consentToShare, $this->localizeEnum($user->verbal_level, EvaluatedLanguageAbility::class)), // Oral interaction level
    //                 $this->canShare($consentToShare, $this->localizeEnum($user->estimated_language_ability, EstimatedLanguageAbility::class)),
    //                 $this->canShare($consentToShare, $this->yesOrNo($user->computed_is_gov_employee)), // Government employee
    //                 $this->canShare($consentToShare, $this->localizeEnum($user->computed_gov_employee_type, GovEmployeeType::class)),
    //                 $this->canShare($consentToShare, $user->work_email), // Work email
    //                 $this->canShare($consentToShare, $user->getClassification()), // Current classification
    //                 $this->canShare($consentToShare, $this->yesOrNo($user->has_priority_entitlement)), // Priority entitlement,
    //                 $this->canShare($consentToShare, $user->priority_number ?? ''), // Priority number
    //                 $this->canShare($consentToShare, $user->position_duration ? $this->yesOrNo($user->wouldAcceptTemporary()) : ''), // Accept temporary
    //                 $this->canShare($consentToShare, $this->localizeEnumArray($preferences['accepted'], OperationalRequirement::class)),
    //                 $this->canShare($consentToShare, $this->localizeEnumArray($user->location_preferences, WorkRegion::class)),
    //                 $this->canShare($consentToShare, $user->location_exemptions), // Location exemptions
    //                 $this->canShare($consentToShare, $this->yesOrNo($user->is_woman)), // Woman
    //                 $this->canShare($consentToShare, $this->localizeEnumArray($indigenousCommunities, IndigenousCommunity::class)),
    //                 $this->canShare($consentToShare, $this->yesOrNo($user->is_visible_minority)), // Visible minority
    //                 $this->canShare($consentToShare, $this->yesOrNo($user->has_disability)), // Disability
    //                 $this->canShare($consentToShare, $userSkills->join(', ')),
    //             ];

    //             // 1 is added to the key to account for the header row
    //             $sheet->fromArray($values, null, sprintf('A%d', $currentTalentNominationGroup + 1));
    //             $currentTalentNominationGroup++;
    //         }
    //     });

    //     return $this;
    // }

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
            ->authorizedToView(['userId' => $this->authenticatedUserId])
            ->isVerifiedGovEmployee();

        return $query;

    }
}
