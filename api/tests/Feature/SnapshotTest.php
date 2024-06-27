<?php

namespace Tests\Feature;

use App\Enums\PoolCandidateStatus;
use App\Models\AwardExperience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Skill;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Faker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertNotNull;
use function PHPUnit\Framework\assertSame;

class SnapshotTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;
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
        // TO DO: Come back and remove once snapshot handled
        $this->markTestSkipped();

        $snapshotQuery = file_get_contents(base_path('app/GraphQL/Mutations/PoolCandidateSnapshot.graphql'), true);
        $user = User::factory()
            ->asApplicant()
            ->create();

        $pool1 = Pool::factory()->published()->create();
        $pool2 = Pool::factory()->published()->create();

        $poolCandidate = PoolCandidate::factory()->create([
            'user_id' => $user->id,
            'pool_id' => $pool1->id,
            'pool_candidate_status' => PoolCandidateStatus::DRAFT->name,
        ]);
        $poolCandidateUnrelated = PoolCandidate::factory()->create([
            'user_id' => $user->id,
            'pool_id' => $pool2->id,
            'pool_candidate_status' => PoolCandidateStatus::DRAFT->name,
        ]);

        // get what the snapshot should look like
        $expectedSnapshot = $this->actingAs($user, 'api')
            ->graphQL($snapshotQuery, ['userId' => $user->id])
            ->json('data.user');

        assertNotNull($expectedSnapshot);

        $poolCandidate->setApplicationSnapshot();

        // get the just-created snapshot
        $actualSnapshot = $this->actingAs($user, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getSnapshot($poolCandidateId:UUID!) {
                poolCandidate(id: $poolCandidateId) {
                  profileSnapshot
                }
              }
            ',
            ['poolCandidateId' => $poolCandidate->id]
        )->json('data.poolCandidate.profileSnapshot');

        $decodedActual = json_decode($actualSnapshot, true);

        // there are two pool candidates present, only one should appear in the snapshot, adjust expectedSnapshot to fit this
        // array_values reindexes the array from zero https://stackoverflow.com/a/3401863
        $filteredPoolCandidates = array_values(array_filter($expectedSnapshot['poolCandidates'], function ($individualPoolCandidate) use ($poolCandidate) {
            return $poolCandidate['id'] === $individualPoolCandidate['id'];
        }));
        $expectedSnapshot['poolCandidates'] = $filteredPoolCandidates;

        // line-up query format with how the snapshot is ordered
        $expectedSnapshot['sub'] = $expectedSnapshot['authInfo']['sub'];
        unset($expectedSnapshot['authInfo']);

        // sort experiences the same way as order does not matter for comparison
        usort($expectedSnapshot['experiences'], function ($a, $b) {
            return strcmp($a['id'], $b['id']);
        });
        usort($decodedActual['experiences'], function ($a, $b) {
            return strcmp($a['id'], $b['id']);
        });

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
                    $skills = Skill::inRandomOrder()->limit(3)->pluck('id')->map(function ($skill_id) use ($faker) {
                        return ['id' => $skill_id, 'details' => $faker->text()];
                    });
                    $model->syncSkills($skills);
                })->create();
        });

        // pool is created and essential/nonessential skills attached implicitly
        $poolCandidate = PoolCandidate::factory()->create([
            'user_id' => $user->id,
            'pool_candidate_status' => PoolCandidateStatus::DRAFT->name,
            'pool_id' => Pool::factory()->withPoolSkills(5, 5),
        ]);

        // collect skills attached to the Pool
        $pool = Pool::with([
            'essentialSkills',
            'nonessentialSkills',
        ])->findOrFail($poolCandidate->pool_id);
        $essentialSkillIds = $pool->essentialSkills()->pluck('skills.id')->toArray();
        $nonessentialSkillIds = $pool->nonessentialSkills()->pluck('skills.id')->toArray();
        $poolSkillIds = array_merge($essentialSkillIds, $nonessentialSkillIds);

        // find the skill ids for skills that exist but are not in $poolSkillIds
        $unusedSkillIds = Skill::whereNotIn('id', $poolSkillIds)->pluck('id')->toArray();

        // submit the application, re-grab the model so as to access profile_snapshot
        $poolCandidate->setApplicationSnapshot();
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

    public function testSetApplicationSnapshotDoesNotOverwrite()
    {
        // non-null snapshot value set
        $user = User::factory()
            ->asApplicant()
            ->create();
        $pool = Pool::factory()->published()->create();
        $poolCandidate = PoolCandidate::factory()->create([
            'user_id' => $user->id,
            'pool_id' => $pool->id,
            'profile_snapshot' => ['snapshot' => 'set'],
        ]);

        $poolCandidate->setApplicationSnapshot();

        $updatedPoolCandidate = PoolCandidate::findOrFail($poolCandidate->id);
        $snapshot = $updatedPoolCandidate->profile_snapshot;

        // snapshot field unchanged
        assertSame(['snapshot' => 'set'], $snapshot);
    }
}
