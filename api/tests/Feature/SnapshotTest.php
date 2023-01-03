<?php

namespace Tests\Feature;

use App\Events\ApplicationSubmitted;
use App\Models\PoolCandidate;
use App\Models\User;
use App\Models\Skill;
use App\Models\Pool;
use App\Models\AwardExperience;
use Database\Helpers\ApiEnums;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Illuminate\Foundation\Testing\WithFaker;

use function PHPUnit\Framework\assertEquals;
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

        // Create admin user we run tests as
        // Note: this extra user does change the results of a couple queries
        $newUser = new User;
        $newUser->email = 'admin@test.com';
        $newUser->sub = 'admin@test.com';
        $newUser->roles = ['ADMIN'];
        $newUser->save();
    }

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testCreateSnapshot()
    {
        $snapshotQuery = file_get_contents(base_path('app/GraphQL/Mutations/PoolCandidateSnapshot.graphql'), true);
        $user = User::factory()->create();

        $poolCandidate = PoolCandidate::factory()->create([
            "user_id" => $user->id,
            "pool_candidate_status" => ApiEnums::CANDIDATE_STATUS_DRAFT
        ]);

        // get what the snapshot should look like
        $expectedSnapshot = $this->graphQL($snapshotQuery, ["userId" => $user->id])->json("data.user");

        ApplicationSubmitted::dispatch($poolCandidate);

        // get the just-created snapshot
        $actualSnapshot = $this->graphQL(
            /** @lang Graphql */
            '
            query getSnapshot($poolCandidateId:ID!) {
                poolCandidate(id: $poolCandidateId) {
                  profileSnapshot
                }
              }
            ',
            ["poolCandidateId" => $poolCandidate->id]
        )->json("data.poolCandidate.profileSnapshot");

        $decodedActual = json_decode($actualSnapshot, true);

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
                    $skills = Skill::inRandomOrder()->limit(3)->pluck('id')->toArray();
                    $data = [
                        $skills[0] => ['details' => $faker->text()],
                        $skills[1] => ['details' => $faker->text()],
                        $skills[2] => ['details' => $faker->text()],
                    ];
                    $model->skills()->sync($data);
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
        foreach ($snapshotExperiences as $experience){
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
