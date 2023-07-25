<?php

use App\Models\AwardExperience;
use App\Models\Skill;
use App\Models\User;
use App\Models\UserSkill;
use App\Models\WorkExperience;
use Illuminate\Foundation\Testing\Concerns\InteractsWithExceptionHandling;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;

class ExperienceTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use RefreshesSchemaCache;
    use InteractsWithExceptionHandling;

    protected $platformAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->bootRefreshesSchemaCache();
        $this->withoutExceptionHandling();
        // Run necessary seeders
        $this->seed(ClassificationSeeder::class);
        $this->seed(RolePermissionSeeder::class);

        $this->platformAdmin = User::factory()
            ->asAdmin()
            ->create([
                'email' => 'admin@test.com',
                'sub' => 'admin@test.com',
            ]);
    }

    /** Test that the hasManyThrough relationships work correctly, and include pivot values. */
    public function testSkillRelationshipsWorkWithPivot(): void
    {
        $userSkills = UserSkill::factory()->count(3)
            ->create(['user_id' => $this->platformAdmin->id]);
        $experience = WorkExperience::factory()->create([
            'user_id' => $this->platformAdmin->id
        ]);
        // Sync userSkills with details
        $experience->userSkills()->sync([
            $userSkills[0]->id => ['details' => 'first skill'],
            $userSkills[1]->id => ['details' => 'second skill'],
            $userSkills[2]->id => ['details' => 'third skill'],
        ]);

        $response = $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUser($id: UUID!) {
                user(id: $id) {
                    workExperiences {
                        id
                        skills {
                            id
                            experienceSkillRecord {
                                details
                            }
                        }
                    }
                }
            }
        ',
            [
                'id' => $this->platformAdmin->id
            ]
        );
        // Assert that the experience  from query with all three skills, and that the pivot details work correctly.
        $response->assertJson(fn (AssertableJson $json) =>
            $json->has('data.user.workExperiences.0', fn (AssertableJson $json) =>
                $json->where('id', $experience->id)
                    ->has('skills', 3)
                    ->has('skills.0', fn (AssertableJson $json) =>
                        $json->where('id', $userSkills[0]->skill_id)
                            ->where('experienceSkillRecord.details', 'first skill')
                    )
            )
        );
    }

    protected function checkCreatesUserSkills($method): void
    {
        $skill = Skill::factory()->create();
        $experience = WorkExperience::factory()->create([
            'user_id' => $this->platformAdmin->id
        ]);
        $experience->$method([
            ['id' => $skill->id]
        ]);
        $this->assertTrue(
            UserSkill::where('user_id', $this->platformAdmin->id)->where('skill_id', $skill->id)->exists()
        );
    }

    protected function checkRestoresSoftDeletedUserSkills($method): void
    {
        $userSkill = UserSkill::factory()->create([
            'user_id' => $this->platformAdmin->id
        ]);
        $userSkill->delete();
        $experience = WorkExperience::factory()->create([
            'user_id' => $this->platformAdmin->id
        ]);
        $experience->$method([
            ['id' => $userSkill->skill_id]
        ]);
        $this->assertNotSoftDeleted($userSkill);
    }

    protected function checkAddsDetails($method): void
    {
        $skill = Skill::factory()->create();
        $experience = WorkExperience::factory()->create([
            'user_id' => $this->platformAdmin->id
        ]);
        $details = 'These are the details of my experience.';
        $experience->$method([
            ['id' => $skill->id, 'details' => $details],
        ]);
        $this->assertEquals(
            $details,
            $experience->skills->first()->experience_skill->details
        );
    }

    protected function checkUpdatesDetails($method): void
    {
        $userSkills = UserSkill::factory(2)->create([
            'user_id' => $this->platformAdmin->id
        ]);
        $experience = WorkExperience::factory()->create([
            'user_id' => $this->platformAdmin->id
        ]);
        $experience->userSkills()->sync([
            $userSkills[0]->id => ['details' => 'first skill'],
            $userSkills[1]->id => ['details' => 'second skill'],
        ]);
        $newDetails1 = "first skill updated";
        $newDetails2 = null;
        $experience->$method([
            ['id' => $userSkills[0]->skill_id, 'details' => $newDetails1],
            ['id' => $userSkills[1]->skill_id, 'details' => $newDetails2],
        ]);
        $this->assertEquals(
            $newDetails1,
            $experience->skills->firstWhere('id', $userSkills[0]->skill_id)->experience_skill->details
        );
        $this->assertEquals(
            $newDetails2,
            $experience->skills->firstWhere('id', $userSkills[1]->skill_id)->experience_skill->details
        );
    }

    protected function checkNullDetailsNullifiesDetails($method): void {
        $userSkill = UserSkill::factory()->create([
            'user_id' => $this->platformAdmin->id
        ]);
        $experience = WorkExperience::factory()->create([
            'user_id' => $this->platformAdmin->id
        ]);
        $details = 'These are the details of my experience.';
        $experience->userSkills()->sync([
            $userSkill->id => ['details' => $details],
        ]);
        $experience->$method([
            ['id' => $userSkill->skill_id, 'details' => null],
        ]);
        $this->assertEquals(
            null,
            $experience->skills->first()->experience_skill->details
        );
    }
    protected function checkUndefinedDetailsDoesNotUpdateDetails($method): void {
        $userSkill = UserSkill::factory()->create([
            'user_id' => $this->platformAdmin->id
        ]);
        $experience = WorkExperience::factory()->create([
            'user_id' => $this->platformAdmin->id
        ]);
        $details = 'These are the details of my experience.';
        $experience->userSkills()->sync([
            $userSkill->id => ['details' => $details],
        ]);
        $experience->$method([
            ['id' => $userSkill->skill_id],
        ]);
        $this->assertEquals(
            $details,
            $experience->skills->first()->experience_skill->details
        );
    }
    protected function checkMethodWorksWithArrayOrSkillCollectionArgs($method): void {
        $skills = Skill::factory(2)->create();
        $experience = WorkExperience::factory()->create([
            'user_id' => $this->platformAdmin->id
        ]);
        $experience2 = AwardExperience::factory()->create([
            'user_id' => $this->platformAdmin->id
        ]);
        $experience->$method([
            ['id' => $skills[0]->id],
            ['id' => $skills[1]->id],
        ]);
        $experience2->$method($skills);
        $this->assertCount(2, $experience->skills);
        $this->assertCount(2, $experience2->skills);
    }

    // syncSkills tests

    public function testSyncSkillsCreatesUserSkills(): void
    {
        $this->checkCreatesUserSkills('syncSkills');
    }
    public function testSyncSkillsRestoresSoftDeletedUserSkills(): void {
        $this->checkRestoresSoftDeletedUserSkills('syncSkills');
    }
    public function testSyncSkillsAddsDetails(): void {
        $this->checkAddsDetails('syncSkills');
    }
    public function testSyncSkillsUpdatesDetails(): void {
        $this->checkUpdatesDetails('syncSkills');
    }
    public function testSyncSkillsRemovesExperienceSkillsWithoutAffectingUserSkills(): void {
        $userSkills = UserSkill::factory(2)->create([
            'user_id' => $this->platformAdmin->id
        ]);
        $experience = WorkExperience::factory()->create([
            'user_id' => $this->platformAdmin->id
        ]);
        $experience->userSkills()->sync([
            $userSkills[0]->id => ['details' => 'first skill'],
            $userSkills[1]->id => ['details' => 'second skill'],
        ]);
        // Sanity check
        $this->assertCount(2, $this->platformAdmin->userSkills);

        $experience->syncSkills([
            ['id' => $userSkills[0]->skill_id],
        ]);
        // After syncing with just one skill, the other experienceSkill should be gone.
        $this->assertCount(1, $experience->skills);
        $this->assertEquals(
            $userSkills[0]->skill_id,
            $experience->skills->first()->id
        );
        // But both userSkills should still exist
        $this->assertCount(2, $this->platformAdmin->userSkills);
    }
    public function testSyncSkillsWorksWithArrayOrSkillCollectionArgs(): void {
        $this->checkMethodWorksWithArrayOrSkillCollectionArgs('syncSkills');
    }
    public function testSyncSkillsNullDetailsNullifiesDetails(): void {
        $this->checkNullDetailsNullifiesDetails('syncSkills');
    }
    public function testSyncSkillsUndefinedDetailsDoesNotUpdateDetails(): void {
        $this->checkUndefinedDetailsDoesNotUpdateDetails('syncSkills');
    }

    // connectSkills tests

    public function testConnectSkillsCreatesUserSkills(): void
    {
        $this->checkCreatesUserSkills('connectSkills');
    }
    public function testConnectSkillsRestoresSoftDeletedUserSkills(): void {
        $this->checkRestoresSoftDeletedUserSkills('connectSkills');
    }
    public function testConnectSkillsAddsDetails(): void {
        $this->checkAddsDetails('connectSkills');
    }
    public function testConnectSkillsUpdatesDetails(): void {
        $this->checkUpdatesDetails('connectSkills');
    }
    public function testConnectSkillsWorksWithArrayOrSkillCollectionArgs(): void {
        $this->checkMethodWorksWithArrayOrSkillCollectionArgs('connectSkills');
    }
    public function testConnectSkillsNullDetailsNullifiesDetails(): void {
        $this->checkNullDetailsNullifiesDetails('connectSkills');
    }
    public function testConnectSkillsUndefinedDetailsDoesNotUpdateDetails(): void {
        $this->checkUndefinedDetailsDoesNotUpdateDetails('connectSkills');
    }

    // disconnectSkills tests

    public function testDisconnectSkillsRemovesExperienceSkillsWithoutAffectingUserSkills(): void {
        $userSkills = UserSkill::factory(2)->create([
            'user_id' => $this->platformAdmin->id
        ]);
        $experience = WorkExperience::factory()->create([
            'user_id' => $this->platformAdmin->id
        ]);
        $experience->userSkills()->sync([
            $userSkills[0]->id => ['details' => 'first skill'],
            $userSkills[1]->id => ['details' => 'second skill'],
        ]);
        $experience->disconnectSkills([
            $userSkills[1]->skill_id,
        ]);
        // After disconnecting one skill only one should remain.
        $this->assertCount(1, $experience->skills);
        $this->assertEquals(
            $userSkills[0]->skill_id,
            $experience->skills->first()->id
        );
        // But both userSkills should still exist.
        $this->assertCount(2, $this->platformAdmin->userSkills);
    }

}
