<?php

use App\Models\ExperienceSkill;
use App\Models\Skill;
use App\Models\WorkExperience;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserSkillTest extends TestCase
{
    use RefreshDatabase;

    protected $platformAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        // Run necessary seeders
        $this->seed(RolePermissionSeeder::class);
    }

    public function testExperienceRelationshipSkipsSoftDeletedPivots(): void {
        Skill::factory()->count(3)->create();
        $experience = WorkExperience::factory()->withSkills(1)->create();
        $userSkill = $experience->userSkills->first();
        // sanity check
        $this->assertCount(1, $userSkill->fresh()->workExperiences);
        // soft-delete one ExperienceSkill
        $pivot = ExperienceSkill::first();
        $pivot->deleted_at = Carbon::now();
        $pivot->save();
        // assert that the soft-deleted relationship is ignored
        $this->assertCount(0, $userSkill->fresh()->workExperiences);
    }
}
