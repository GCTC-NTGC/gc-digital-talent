<?php

namespace Tests\Feature;

use App\Events\ApplicationSubmitted;
use App\Models\PoolCandidate;
use App\Models\User;
use App\Models\Skill;
use App\Models\Pool;
use App\Models\AwardExperience;
use Database\Helpers\ApiEnums;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Illuminate\Foundation\Testing\WithFaker;

use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertNotNull;
use Faker;

class SnapshotTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use RefreshesSchemaCache;
    use WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->bootRefreshesSchemaCache();
        $this->seed(RolePermissionSeeder::class);
    }

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testCreateSnapshot()
    {
        $snapshotQuery = file_get_contents(base_path('app/GraphQL/Mutations/PoolCandidateSnapshot.graphql'), true);
        $user = User::factory()
            ->asApplicant()
            ->create();

        $poolCandidate = PoolCandidate::factory()->create([
            "user_id" => $user->id,
            "pool_candidate_status" => ApiEnums::CANDIDATE_STATUS_DRAFT
        ]);
        $poolCandidateUnrelated = PoolCandidate::factory()->create([
            "user_id" => $user->id,
            "pool_candidate_status" => ApiEnums::CANDIDATE_STATUS_DRAFT
        ]);

        // get what the snapshot should look like
        $expectedSnapshot = $this->actingAs($user, "api")
            ->graphQL($snapshotQuery, ["userId" => $user->id])
            ->json("data.user");

        assertNotNull($expectedSnapshot);

        ApplicationSubmitted::dispatch($poolCandidate);

        // get the just-created snapshot
        $actualSnapshot = $this->actingAs($user, "api")->graphQL(
            /** @lang GraphQL */
            '
            query getSnapshot($poolCandidateId:UUID!) {
                poolCandidate(id: $poolCandidateId) {
                  profileSnapshot
                }
              }
            ',
            ["poolCandidateId" => $poolCandidate->id]
        )->json("data.poolCandidate.profileSnapshot");

        $decodedActual = json_decode($actualSnapshot, true);

        // there are two pool candidates present, only one should appear in the snapshot, adjust expectedSnapshot to fit this
        $filteredPoolCandidates = array_filter($expectedSnapshot['poolCandidates'], function ($individualPoolCandidate) use ($poolCandidate) {
            return in_array($poolCandidate['id'], $individualPoolCandidate);
        });
        $expectedSnapshot['poolCandidates'] = $filteredPoolCandidates;

        assertEquals($expectedSnapshot, $decodedActual);
    }

    public function testSnapshotSkillFiltering()
    {
        Skill::factory(20)->create();

        $user = User::factory()->create();
        $faker = Faker\Factory::create();
        User::all()->each(function ($user) use ($faker) {
            AwardExperience::factory()
                ->count(2)
                ->for($user)
                ->afterCreating(function ($model) use ($faker) {
                    $skills = Skill::inRandomOrder()->limit(3)->pluck('id')->map(function ($skill) use ($faker) {
                        return ['id' => $skill->id, 'details' => $faker->text()];
                    });
                    $model->syncSkills($skills);
                })->create();
        });

        // pool is created and essential/nonessential skills attached implicitly
        $poolCandidate = PoolCandidate::factory()->create([
            "user_id" => $user->id,
            "pool_candidate_status" => ApiEnums::CANDIDATE_STATUS_DRAFT
        ]);

        // collect skills attached to the Pool
        $pool = Pool::with([
            'essentialSkills',
            'nonessentialSkills'
        ])->findOrFail($poolCandidate->pool_id);
        $essentialSkillIds = $pool->essentialSkills()->pluck('id')->toArray();
        $nonessentialSkillIds = $pool->nonessentialSkills()->pluck('id')->toArray();
        $poolSkillIds = array_merge($essentialSkillIds, $nonessentialSkillIds);

        // find the skill ids for skills that exist but are not in $poolSkillIds
        $unusedSkillIds = Skill::whereNotIn('id', $poolSkillIds)->pluck('id')->toArray();

        // submit the application, re-grab the model so as to access profile_snapshot
        ApplicationSubmitted::dispatch($poolCandidate);
        $updatedPoolCandidate = PoolCandidate::findOrFail($poolCandidate->id);
        $snapshot = $updatedPoolCandidate->profile_snapshot;

        // build array $snapshotSkills that contains all the skills ids found on the snapshot
        $snapshotSkillIds = [];
        $snapshotExperiences = $snapshot['experiences'];
        foreach ($snapshotExperiences as $experience) {
            $experienceSkills = $experience['skills'];
            foreach ($experienceSkills as $skill) {
                array_push($snapshotSkillIds, $skill['id']);
            }
        }

        // generate an overlap area between the unused skills and snapshot skills
        // assert it has a length of zero, therefore, no unused skills were saved to the snapshot
        $intersectedArray = array_intersect($unusedSkillIds, $snapshotSkillIds);
        $intersectedArrayLength = count($intersectedArray);
        assertEquals($intersectedArrayLength, 0);
    }
}
