<?php

namespace Tests\Feature;

use App\Enums\TalentNominationGroupDecision;
use App\Enums\TalentNominationGroupStatus;
use App\Models\TalentNomination;
use App\Models\TalentNominationGroup;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

class TalentNominationGroupStatusTest extends TestCase
{
    use RefreshDatabase;
    use RefreshesSchemaCache;

    protected $nomination;

    protected $talentNominationGroup;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        $this->seed(SkillFamilySeeder::class);
        $this->seed(SkillSeeder::class);

        $nominator = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'nominator@test.com',
                'computed_is_gov_employee' => true,
                'work_email' => 'nominator@gc.ca',
                'work_email_verified_at' => now(),
            ]);

        $nominee = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'nominee@test.com',
                'computed_is_gov_employee' => true,
                'work_email' => 'nominee@gc.ca',
                'work_email_verified_at' => now(),
            ]);

        $this->nomination = TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'nominator_id' => $nominator->id,
                'nominee_id' => $nominee->id,
            ]);

        $this->talentNominationGroup = TalentNominationGroup::sole();
    }

    /**
     * @dataProvider statusProvider
     */
    public function testStatusIsComputedCorrectly($nominationState, $nominationGroupState, $expectedStatus)
    {
        $this->nomination->update($nominationState);
        $this->nomination->save();

        $this->talentNominationGroup->update($nominationGroupState);
        $this->talentNominationGroup->save();

        $this->assertEquals($expectedStatus, $this->talentNominationGroup->status);
    }

    public static function statusProvider()
    {
        return [
            'all options nominated and all approved' => [
                [
                    'nominate_for_advancement' => true,
                    'nominate_for_lateral_movement' => true,
                    'nominate_for_development_programs' => true,
                ],
                [
                    'advancement_decision' => TalentNominationGroupDecision::APPROVED->name,
                    'lateral_movement_decision' => TalentNominationGroupDecision::APPROVED->name,
                    'development_programs_decision' => TalentNominationGroupDecision::APPROVED->name,
                ],
                TalentNominationGroupStatus::APPROVED->name,
            ],
            'some options nominated and all approved' => [
                [
                    'nominate_for_advancement' => true,
                    'nominate_for_lateral_movement' => true,
                    'nominate_for_development_programs' => false,
                ],
                [
                    'advancement_decision' => TalentNominationGroupDecision::APPROVED->name,
                    'lateral_movement_decision' => TalentNominationGroupDecision::APPROVED->name,
                    'development_programs_decision' => null,
                ],
                TalentNominationGroupStatus::APPROVED->name,
            ],
            'all options nominated and some approved' => [
                [
                    'nominate_for_advancement' => true,
                    'nominate_for_lateral_movement' => true,
                    'nominate_for_development_programs' => true,
                ],
                [
                    'advancement_decision' => TalentNominationGroupDecision::APPROVED->name,
                    'lateral_movement_decision' => TalentNominationGroupDecision::APPROVED->name,
                    'development_programs_decision' => null,
                ],
                TalentNominationGroupStatus::IN_PROGRESS->name,
            ],
            'all options nominated and some rejected' => [
                [
                    'nominate_for_advancement' => true,
                    'nominate_for_lateral_movement' => true,
                    'nominate_for_development_programs' => true,
                ],
                [
                    'advancement_decision' => TalentNominationGroupDecision::REJECTED->name,
                    'lateral_movement_decision' => TalentNominationGroupDecision::REJECTED->name,
                    'development_programs_decision' => null,
                ],
                TalentNominationGroupStatus::IN_PROGRESS->name,
            ],
            'all options nominated and some approved and some rejected' => [
                [
                    'nominate_for_advancement' => true,
                    'nominate_for_lateral_movement' => true,
                    'nominate_for_development_programs' => true,
                ],
                [
                    'advancement_decision' => TalentNominationGroupDecision::APPROVED->name,
                    'lateral_movement_decision' => TalentNominationGroupDecision::REJECTED->name,
                    'development_programs_decision' => null,
                ],
                TalentNominationGroupStatus::IN_PROGRESS->name,
            ],
            'all options nominated and all approved or rejected' => [
                [
                    'nominate_for_advancement' => true,
                    'nominate_for_lateral_movement' => true,
                    'nominate_for_development_programs' => true,
                ],
                [
                    'advancement_decision' => TalentNominationGroupDecision::APPROVED->name,
                    'lateral_movement_decision' => TalentNominationGroupDecision::APPROVED->name,
                    'development_programs_decision' => TalentNominationGroupDecision::REJECTED->name,
                ],
                TalentNominationGroupStatus::PARTIALLY_APPROVED->name,
            ],
            'some options nominated and all approved or rejected' => [
                [
                    'nominate_for_advancement' => true,
                    'nominate_for_lateral_movement' => true,
                    'nominate_for_development_programs' => false,
                ],
                [
                    'advancement_decision' => TalentNominationGroupDecision::APPROVED->name,
                    'lateral_movement_decision' => TalentNominationGroupDecision::REJECTED->name,
                    'development_programs_decision' => null,
                ],
                TalentNominationGroupStatus::PARTIALLY_APPROVED->name,
            ],
            'all options nominated and all rejected' => [
                [
                    'nominate_for_advancement' => true,
                    'nominate_for_lateral_movement' => true,
                    'nominate_for_development_programs' => true,
                ],
                [
                    'advancement_decision' => TalentNominationGroupDecision::REJECTED->name,
                    'lateral_movement_decision' => TalentNominationGroupDecision::REJECTED->name,
                    'development_programs_decision' => TalentNominationGroupDecision::REJECTED->name,
                ],
                TalentNominationGroupStatus::REJECTED->name,
            ],
            'some options nominated and all rejected' => [
                [
                    'nominate_for_advancement' => true,
                    'nominate_for_lateral_movement' => true,
                    'nominate_for_development_programs' => false,
                ],
                [
                    'advancement_decision' => TalentNominationGroupDecision::REJECTED->name,
                    'lateral_movement_decision' => TalentNominationGroupDecision::REJECTED->name,
                    'development_programs_decision' => null,
                ],
                TalentNominationGroupStatus::REJECTED->name,
            ],
        ];
    }
}
