<?php

namespace Tests\Feature;

use App\Models\AwardExperience;
use App\Models\ExperienceSkill;
use App\Models\Skill;
use App\Models\User;
use App\Models\UserSkill;
use App\Models\WorkExperience;
use Carbon\Carbon;
use Database\Seeders\ClassificationSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\Concerns\InteractsWithExceptionHandling;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

use function PHPUnit\Framework\assertEquals;

class ExperienceTest extends TestCase
{
    use InteractsWithExceptionHandling;
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

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
            ->create([
                'user_id' => $this->platformAdmin->id,
                'skill_id' => Skill::factory(),
            ]);
        $experience = WorkExperience::factory()->create([
            'user_id' => $this->platformAdmin->id,
        ]);
        // Sync userSkills with details
        $experience->userSkills()->sync([
            $userSkills[0]->id => ['details' => 'first skill'],
            $userSkills[1]->id => ['details' => 'second skill'],
            $userSkills[2]->id => ['details' => 'third skill'],
        ]);

        $response = $this->actingAs($this->platformAdmin, 'api')->graphQL(<<<'GRAPHQL'
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
        GRAPHQL,
            [
                'id' => $this->platformAdmin->id,
            ]
        );

        $this->assertEqualsCanonicalizing([
            [

                'id' => $userSkills[0]->skill->id,
                'experienceSkillRecord' => [
                    'details' => 'first skill',
                ],
            ],
            [
                'id' => $userSkills[1]->skill->id,
                'experienceSkillRecord' => [
                    'details' => 'second skill',
                ],
            ],
            [
                'id' => $userSkills[2]->skill->id,
                'experienceSkillRecord' => [
                    'details' => 'third skill',
                ],
            ],
        ], $response['data']['user']['workExperiences'][0]['skills']);
    }

    protected function checkCreatesUserSkills($method): void
    {
        $skill = Skill::factory()->create();
        $experience = WorkExperience::factory()->create([
            'user_id' => $this->platformAdmin->id,
        ]);
        $experience->$method([
            ['id' => $skill->id],
        ]);
        $this->assertTrue(
            UserSkill::where('user_id', $this->platformAdmin->id)->where('skill_id', $skill->id)->exists()
        );
    }

    protected function checkRestoresSoftDeletedUserSkills($method): void
    {
        $userSkill = UserSkill::factory()->create([
            'user_id' => $this->platformAdmin->id,
        ]);
        $userSkill->delete();
        $experience = WorkExperience::factory()->create([
            'user_id' => $this->platformAdmin->id,
        ]);
        $experience->$method([
            ['id' => $userSkill->skill_id],
        ]);
        $this->assertNotSoftDeleted($userSkill);
    }

    protected function checkAddsDetails($method): void
    {
        $skill = Skill::factory()->create();
        $experience = WorkExperience::factory()->create([
            'user_id' => $this->platformAdmin->id,
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
            'user_id' => $this->platformAdmin->id,
            'skill_id' => Skill::factory(),
        ]);
        $experience = WorkExperience::factory()->create([
            'user_id' => $this->platformAdmin->id,
        ]);
        $experience->userSkills()->sync([
            $userSkills[0]->id => ['details' => 'first skill'],
            $userSkills[1]->id => ['details' => 'second skill'],
        ]);
        $newDetails1 = 'first skill updated';
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

    protected function checkNullDetailsNullifiesDetails($method): void
    {
        $userSkill = UserSkill::factory()->create([
            'user_id' => $this->platformAdmin->id,
        ]);
        $experience = WorkExperience::factory()->create([
            'user_id' => $this->platformAdmin->id,
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

    protected function checkUndefinedDetailsDoesNotUpdateDetails($method): void
    {
        $userSkill = UserSkill::factory()->create([
            'user_id' => $this->platformAdmin->id,
        ]);
        $experience = WorkExperience::factory()->create([
            'user_id' => $this->platformAdmin->id,
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

    protected function checkMethodWorksWithArrayOrSkillCollectionArgs($method): void
    {
        $skills = Skill::factory(2)->create();
        $experience = WorkExperience::factory()->create([
            'user_id' => $this->platformAdmin->id,
        ]);
        $experience2 = AwardExperience::factory()->create([
            'user_id' => $this->platformAdmin->id,
        ]);
        $experience->$method([
            ['id' => $skills[0]->id],
            ['id' => $skills[1]->id],
        ]);
        $experience2->$method($skills);
        $this->assertCount(2, $experience->skills);
        $this->assertCount(2, $experience2->skills);
    }

    public function checkMethodRestoresSoftDeletedPivots($method): void
    {
        $userSkill = UserSkill::factory()->create([
            'user_id' => $this->platformAdmin->id,
        ]);
        $experience = WorkExperience::factory()->create([
            'user_id' => $this->platformAdmin->id,
        ]);
        $experienceSkill = new ExperienceSkill();
        $experienceSkill->experience_id = $experience->id;
        $experienceSkill->user_skill_id = $userSkill->id;
        $experienceSkill->details = 'some details';
        $experienceSkill->experience_type = WorkExperience::class;
        $experienceSkill->save();

        // sanity check
        $this->assertCount(1, $experience->fresh()->userSkills);

        // now manually soft-delete the experienceSkill
        $experienceSkill->deleted_at = Carbon::now();
        $experienceSkill->save();

        // now connect the same skill again
        $experience->refresh()->$method([
            ['id' => $userSkill->skill_id],
        ]);

        // now check that the experienceSkill is no longer soft-deleted, and the pivot details is same as before.
        $this->assertNull($experienceSkill->fresh()->deleted_at);
        $this->assertEquals('some details', $experience->userSkills->first()->experience_skill->details);
    }

    // syncSkills tests

    public function testSyncSkillsCreatesUserSkills(): void
    {
        $this->checkCreatesUserSkills('syncSkills');
    }

    public function testSyncSkillsRestoresSoftDeletedUserSkills(): void
    {
        $this->checkRestoresSoftDeletedUserSkills('syncSkills');
    }

    public function testSyncSkillsAddsDetails(): void
    {
        $this->checkAddsDetails('syncSkills');
    }

    public function testSyncSkillsUpdatesDetails(): void
    {
        $this->checkUpdatesDetails('syncSkills');
    }

    public function testSyncSkillsRemovesExperienceSkillsWithoutAffectingUserSkills(): void
    {
        $userSkills = UserSkill::factory(2)->create([
            'user_id' => $this->platformAdmin->id,
            'skill_id' => Skill::factory(),
        ]);
        $experience = WorkExperience::factory()->create([
            'user_id' => $this->platformAdmin->id,
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

    public function testSyncSkillsWorksWithArrayOrSkillCollectionArgs(): void
    {
        $this->checkMethodWorksWithArrayOrSkillCollectionArgs('syncSkills');
    }

    public function testSyncSkillsNullDetailsNullifiesDetails(): void
    {
        $this->checkNullDetailsNullifiesDetails('syncSkills');
    }

    public function testSyncSkillsUndefinedDetailsDoesNotUpdateDetails(): void
    {
        $this->checkUndefinedDetailsDoesNotUpdateDetails('syncSkills');
    }

    public function testSyncSkillsOnlySoftDeletesPivots(): void
    {
        $userSkills = UserSkill::factory(2)->create([
            'user_id' => $this->platformAdmin->id,
            'skill_id' => Skill::factory(),
        ]);
        $experience = WorkExperience::factory()->create([
            'user_id' => $this->platformAdmin->id,
        ]);
        $experience->userSkills()->sync([
            $userSkills[0]->id => ['details' => 'first skill'],
            $userSkills[1]->id => ['details' => 'second skill'],
        ]);
        // Sanity check
        $this->assertCount(2, ExperienceSkill::all());

        $experience->syncSkills([
            ['id' => $userSkills[0]->skill_id],
        ]);
        // After syncing with just one skill, the other experienceSkill should be soft-deleted but otherwise unchanged.
        $experienceSkill = ExperienceSkill::withTrashed()
            ->where('user_skill_id', $userSkills[1]->id)
            ->where('experience_id', $experience->id)
            ->first();
        $this->assertNotNull($experienceSkill);
        $this->assertTrue($experienceSkill->trashed());
        $this->assertEquals('second skill', $experienceSkill->details);
    }

    public function testSyncSkillsRestoresSoftDeletedPivots(): void
    {
        $this->checkMethodRestoresSoftDeletedPivots('syncSkills');
    }

    // connectSkills tests

    public function testConnectSkillsCreatesUserSkills(): void
    {
        $this->checkCreatesUserSkills('connectSkills');
    }

    public function testConnectSkillsRestoresSoftDeletedUserSkills(): void
    {
        $this->checkRestoresSoftDeletedUserSkills('connectSkills');
    }

    public function testConnectSkillsAddsDetails(): void
    {
        $this->checkAddsDetails('connectSkills');
    }

    public function testConnectSkillsUpdatesDetails(): void
    {
        $this->checkUpdatesDetails('connectSkills');
    }

    public function testConnectSkillsWorksWithArrayOrSkillCollectionArgs(): void
    {
        $this->checkMethodWorksWithArrayOrSkillCollectionArgs('connectSkills');
    }

    public function testConnectSkillsNullDetailsNullifiesDetails(): void
    {
        $this->checkNullDetailsNullifiesDetails('connectSkills');
    }

    public function testConnectSkillsUndefinedDetailsDoesNotUpdateDetails(): void
    {
        $this->checkUndefinedDetailsDoesNotUpdateDetails('connectSkills');
    }

    public function testConnectSkillsRestoresSoftDeletedPivots(): void
    {
        $this->checkMethodRestoresSoftDeletedPivots('connectSkills');
    }

    // disconnectSkills tests

    public function testDisconnectSkillsRemovesExperienceSkillsWithoutAffectingUserSkills(): void
    {
        $userSkills = UserSkill::factory(2)->create([
            'user_id' => $this->platformAdmin->id,
            'skill_id' => Skill::factory(),
        ]);
        $experience = WorkExperience::factory()->create([
            'user_id' => $this->platformAdmin->id,
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

    public function testDisconnectSkillsOnlySoftDeletesPivots(): void
    {
        $userSkill = UserSkill::factory()->create([
            'user_id' => $this->platformAdmin->id,
        ]);
        $experience = WorkExperience::factory()->create([
            'user_id' => $this->platformAdmin->id,
        ]);
        $experience->userSkills()->sync([
            $userSkill->id => ['details' => 'some details'],
        ]);
        // sanity check
        $experienceSkill = ExperienceSkill::where('user_skill_id', $userSkill->id)
            ->where('experience_id', $experience->id)
            ->first();
        $this->assertNotNull($experienceSkill);

        // After disconnecting, the ExperienceSkill should still exist but soft-deleted but otherwise unchanged.
        $experience->disconnectSkills([
            $userSkill->skill_id,
        ]);
        $freshExperienceSkill = ExperienceSkill::withTrashed()
            ->where('user_skill_id', $userSkill->id)
            ->where('experience_id', $experience->id)
            ->first();
        $this->assertTrue($freshExperienceSkill->trashed());
        $this->assertEquals('some details', $freshExperienceSkill->details);
    }

    public function testUserSkillRelationshipSkipsSoftDeletedPivots(): void
    {
        Skill::factory()->count(3)->create();
        $experience = AwardExperience::factory()->withSkills(3)->create();
        // sanity check
        $this->assertCount(3, $experience->fresh()->userSkills);
        // soft-delete one ExperienceSkill
        $pivot = ExperienceSkill::first();
        $pivot->deleted_at = Carbon::now();
        $pivot->save();
        // assert that the soft-deleted relationship is ignored
        $this->assertCount(2, $experience->fresh()->userSkills);
    }

    public function testSkillRelationshipSkipsSoftDeletedPivots(): void
    {
        Skill::factory()->count(3)->create();
        $experience = AwardExperience::factory()->withSkills(3)->create();
        // sanity check
        $this->assertCount(3, $experience->fresh()->skills);
        // soft-delete one ExperienceSkill
        $pivot = ExperienceSkill::first();
        $pivot->deleted_at = Carbon::now();
        $pivot->save();
        // assert that the soft-deleted relationship is ignored
        $this->assertCount(2, $experience->fresh()->skills);
    }

    public function testExperiencesFetchSoftDeletedSkills(): void
    {
        // create experience with three skills, then soft delete a skill
        Skill::factory()->count(3)->create();
        $experience = AwardExperience::factory()->withSkills(3)->create([
            'user_id' => $this->platformAdmin->id,
        ]);
        $randomDeletedSkill = Skill::first();
        $randomDeletedSkill->delete();

        // query a user's experience/skills
        $response = $this->actingAs($this->platformAdmin, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
        query user($id: UUID!) {
            user(id: $id) {
                id
                experiences {
                    skills {
                     id
                    }
                }
            }
        }
        ',
                [
                    'id' => $this->platformAdmin->id,
                ]
            )->assertSuccessful();

        // grab the skills for the experience, should be array of one experience
        $skills = $response['data']['user']['experiences'][0]['skills'];
        // assert 3 skills grabbed, therefore soft deleted skill still reached
        assertEquals(count($skills), 3);
    }
}
