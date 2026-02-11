<?php

namespace Tests\Feature\Snapshots;

use App\Enums\ApplicationStatus;
use App\Enums\EmploymentCategory;
use App\Enums\Language;
use App\Enums\OperationalRequirement;
use App\Models\AwardExperience;
use App\Models\CommunityExperience;
use App\Models\EducationExperience;
use App\Models\PersonalExperience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Skill;
use App\Models\User;
use App\Models\WorkExperience;
use App\ValueObjects\ProfileSnapshot;
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
            ->withGovEmployeeProfile()
            ->create();

        AwardExperience::factory()->create(['user_id' => $user->id]);
        CommunityExperience::factory()->create(['user_id' => $user->id]);
        EducationExperience::factory()->create(['user_id' => $user->id]);
        PersonalExperience::factory()->create(['user_id' => $user->id]);

        WorkExperience::factory()->create([
            'user_id' => $user->id,
            'employment_category' => EmploymentCategory::EXTERNAL_ORGANIZATION->name,
        ]);
        WorkExperience::factory()->create([
            'user_id' => $user->id,
            'employment_category' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
        ]);
        WorkExperience::factory()->create([
            'user_id' => $user->id,
            'employment_category' => EmploymentCategory::CANADIAN_ARMED_FORCES->name,
        ]);

        $pool1 = Pool::factory()->published()->create();
        $pool2 = Pool::factory()->published()->create();

        // Ensure user has pool skills
        $essentialSkills = $pool1->essentialSkills()->get();
        $skillsArray = $essentialSkills->map(fn ($skill) => ['id' => $skill->id])->all();
        foreach (WorkExperience::where('user_id', $user->id)->with('user')->get() as $exp) {
            $exp->syncSkills($skillsArray);
        }

        $poolCandidate = PoolCandidate::factory()->create([
            'user_id' => $user->id,
            'pool_id' => $pool1->id,
            'application_status' => ApplicationStatus::DRAFT->name,
        ]);
        $poolCandidateUnrelated = PoolCandidate::factory()->create([
            'user_id' => $user->id,
            'pool_id' => $pool2->id,
            'application_status' => ApplicationStatus::DRAFT->name,
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
        $this->unsetLocalizedKey($decodedActual);

        // Add version number
        $expectedSnapshot['version'] = ProfileSnapshot::$VERSION;

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
            'application_status' => ApplicationStatus::DRAFT->name,
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

    public function testLocalizingLegacyEnums()
    {
        // non-null snapshot value set
        $user = User::factory()
            ->asApplicant()
            ->create();
        $pool = Pool::factory()->published()->create();
        $poolCandidate = PoolCandidate::factory()->create([
            'user_id' => $user->id,
            'pool_id' => $pool->id,
            'profile_snapshot' => [
                // Single enum
                'preferredLang' => Language::EN->toLower(),
                // Array based enum
                'acceptedOperationalRequirements' => [
                    OperationalRequirement::DRIVERS_LICENSE->name,
                    // Confirm does not double parse
                    [
                        'value' => OperationalRequirement::ON_CALL->name,
                        'label' => OperationalRequirement::localizedString(
                            OperationalRequirement::ON_CALL->name
                        ),
                    ],
                ],
                // Empty string details
                // NOTE: Regression test for empty strings treated as localized enums
                'experiences' => [
                    [
                        'details' => '',
                    ],
                ],
            ],
        ]);

        $snapshot = $poolCandidate->profile_snapshot;

        // snapshot contains localized enums
        assertSame([
            // Single enum
            'preferredLang' => [
                'value' => Language::EN->toLower(),
                'label' => Language::localizedString(Language::EN->name),
            ],
            // Array based enum
            'acceptedOperationalRequirements' => [
                [
                    'value' => OperationalRequirement::DRIVERS_LICENSE->name,
                    'label' => OperationalRequirement::localizedString(OperationalRequirement::DRIVERS_LICENSE->name),
                ],
                [
                    'value' => OperationalRequirement::ON_CALL->name,
                    'label' => OperationalRequirement::localizedString(OperationalRequirement::ON_CALL->name),
                ],
            ],
            // Empty string details
            'experiences' => [
                [
                    'details' => '',
                ],
            ],
        ], $snapshot);
    }

    private function unsetLocalizedKey(array &$arr)
    {
        if (is_array($arr)) {
            unset($arr['localized']);
        }
        foreach ($arr as &$v) {
            if (is_array($v)) {
                $this->unsetLocalizedKey($v);
            }
        }
    }
}
