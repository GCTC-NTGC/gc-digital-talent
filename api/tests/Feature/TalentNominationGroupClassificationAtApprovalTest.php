<?php

namespace Tests\Feature;

use App\Enums\TalentNominationGroupDecision;
use App\Models\Classification;
use App\Models\TalentNomination;
use App\Models\TalentNominationGroup;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

class TalentNominationGroupClassificationAtApprovalTest extends TestCase
{
    use RefreshDatabase;
    use RefreshesSchemaCache;

    protected TalentNominationGroup $talentNominationGroup;

    protected Classification $nomineeClassification;

    protected function setUp(): void
    {
        parent::setUp();

        Notification::fake(); // don't try to send any "nomination received" notifications

        $this->seed(RolePermissionSeeder::class);
        $this->seed(SkillFamilySeeder::class);
        $this->seed(SkillSeeder::class);

        $this->nomineeClassification = Classification::factory()->create();

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
                'computed_classification' => $this->nomineeClassification->id,
            ]);

        TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'nominator_id' => $nominator->id,
                'nominee_id' => $nominee->id,
                'nominate_for_advancement' => true,
            ]);

        $this->talentNominationGroup = TalentNominationGroup::sole();
        $this->assertNull($this->talentNominationGroup->classification_at_time_of_advancement_approval_id);
    }

    public function testClassificationIsRecordedWhenAdvancementIsApproved()
    {
        $this->talentNominationGroup->update([
            'advancement_decision' => TalentNominationGroupDecision::APPROVED->name,
        ]);

        $this->assertEquals(
            $this->nomineeClassification->id,
            $this->talentNominationGroup->fresh()->classification_at_time_of_advancement_approval_id
        );
    }

    public function testClassificationIsClearedWhenAdvancementIsRejected()
    {
        // first approve so a classification is recorded
        $this->talentNominationGroup->update([
            'advancement_decision' => TalentNominationGroupDecision::APPROVED->name,
        ]);
        $this->assertNotNull($this->talentNominationGroup->fresh()->classification_at_time_of_advancement_approval_id);

        // then reject and confirm the classification is cleared
        $this->talentNominationGroup->update([
            'advancement_decision' => TalentNominationGroupDecision::REJECTED->name,
        ]);

        $this->assertNull($this->talentNominationGroup->fresh()->classification_at_time_of_advancement_approval_id);
    }

    public function testApprovingAdvancementWithNoNomineeClassificationLeavesFieldNull()
    {
        $nominator = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'nominator2@test.com',
                'computed_is_gov_employee' => true,
                'work_email' => 'nominator2@gc.ca',
                'work_email_verified_at' => now(),
            ]);

        $nominee = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'nominee2@test.com',
                'computed_is_gov_employee' => true,
                'work_email' => 'nominee2@gc.ca',
                'work_email_verified_at' => now(),
                'computed_classification' => null,
            ]);

        TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'nominator_id' => $nominator->id,
                'nominee_id' => $nominee->id,
                'nominate_for_advancement' => true,
            ]);

        $talentNominationGroup = TalentNominationGroup::where('nominee_id', $nominee->id)->sole();

        $talentNominationGroup->update([
            'advancement_decision' => TalentNominationGroupDecision::APPROVED->name,
        ]);

        $this->assertNull($talentNominationGroup->fresh()->classification_at_time_of_advancement_approval_id);
    }

    public function testUnrelatedDecisionChangesDoNotAffectClassification()
    {
        $this->talentNominationGroup->update([
            'lateral_movement_decision' => TalentNominationGroupDecision::APPROVED->name,
        ]);
        $this->assertNull($this->talentNominationGroup->fresh()->classification_at_time_of_advancement_approval_id);

        $this->talentNominationGroup->update([
            'lateral_movement_decision' => TalentNominationGroupDecision::REJECTED->name,
            'development_programs_decision' => TalentNominationGroupDecision::APPROVED->name,
        ]);
        $this->assertNull($this->talentNominationGroup->fresh()->classification_at_time_of_advancement_approval_id);
    }
}
