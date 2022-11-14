<?php

namespace Tests\Feature;

use App\Models\Pool;
use App\Models\CmoAsset;
use App\Models\Classification;
use App\Models\PoolCandidate;
use App\Models\User;
use Database\Helpers\ApiEnums;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\ClearsSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;

use Faker;
use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertGreaterThan;

class PoolCandidateMigrationArtisanCommandsTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use ClearsSchemaCache;

    protected function setUp(): void
    {
        parent::setUp();

        $this->bootClearsSchemaCache();

        // Create admin user we run tests as
        // Note: this extra user does change the results of a couple queries
        $newUser = new User;
        $newUser->email = 'Anne-marie.kirouac@tbs-sct.gc.ca';
        $newUser->sub = 'admin@test.com';
        $newUser->roles = ['ADMIN'];
        $newUser->save();
    }

    /**
     * testing api\app\Console\Commands\CreateDigitalCareersPools.php
     */
    public function testRunningArtisanPoolCreation()
    {
        $this->artisan('db:seed --class=ClassificationSeeder');
        $this->artisan('db:seed --class=CmoAssetSeeder');
        $this->artisan('db:seed --class=SkillFamilySeeder');
        $this->artisan('db:seed --class=SkillSeeder');

        // run the command
        $this->artisan('create:digital_careers_pools')->assertSuccessful();

        // assert 36 pools were created
        $allPools = Pool::all();
        assertEquals(36, count($allPools));

        // assert each classification has 9 pools each
        $itLevels = [1, 2, 3, 4];
        foreach ($itLevels as $level) {
            $classificationGroup = Pool::where('key', null)
                                        ->whereHas('classifications', function($query) use ($level) {
                                            $query->where('group', 'ilike', 'IT')
                                                    ->where('level', $level);
                                        })
                                        ->get();
            assertEquals(9, count($classificationGroup));
        }
    }

    /**
     * testing api\app\Console\Commands\CreateDigitalCareersPoolsCandidates.php
     */
    public function testRunningArtisanPoolCandidateCreation()
    {
        //
        // set up environment to test in, create the pool with candidates connected to users
        //
        $faker = Faker\Factory::create();

        $this->artisan('db:seed --class=ClassificationSeeder');
        $this->artisan('db:seed --class=CmoAssetSeeder');
        $this->artisan('db:seed --class=SkillFamilySeeder');
        $this->artisan('db:seed --class=SkillSeeder');
        $this->artisan('db:seed --class=SkillSeeder');

        $owner = User::where('sub', 'ilike', 'admin@test.com')->sole();
        $oldDigitalPool = Pool::factory()->create([
            'user_id' => $owner['id'],
            'name' => [
                'en' => 'CMO Digital Careers',
                'fr' => 'CMO Carrières Numériques'
            ],
            'key' => 'digital_careers',
        ]);

        User::factory([
            'roles' => [ApiEnums::ROLE_APPLICANT]
        ])
            ->count(50)
            ->afterCreating(function (User $user) use ($faker) {
                $assets = CmoAsset::inRandomOrder()->limit(4)->pluck('id')->toArray();
                $user->cmoAssets()->sync($assets);
                $digitalTalentPool = Pool::where('key', "digital_careers")->first();

                if (rand(0, 1)) {
                    $classification = Classification::inRandomOrder()->limit(1)->pluck('id')->toArray();
                    $user->expectedClassifications()->sync($classification);
                    $user->expected_salary = [];
                    $user->save();

                } else {
                    $user->expected_salary = $faker->randomElements(ApiEnums::salaryRanges(), 2);
                    $user->save();
                    $user->expectedClassifications()->sync([]);
                }

                PoolCandidate::factory()->count(1)->sequence(fn () => [
                    'pool_id' => $digitalTalentPool->id,
                    'user_id' => $user->id,
                ])->create();
            })
        ->create();

        //
        // can now begin testing stage
        //

        //
        // collect some info before running the command
        //

        // calculate users eligible for IT-04 POOL_STREAM_SOFTWARE_SOLUTIONS
        // salary range 'min_salary' => 101541, 'max_salary' => 126390,
        // assets that maps to that stream are app_dev and app_testing
        $appDevId = CmoAsset::where('key', 'ilike', 'app_dev')->sole()['id'];
        $appTestingId = CmoAsset::where('key', 'ilike', 'app_testing')->sole()['id'];
        $it04Id = Classification::where('group', 'ilike', 'IT')->where('level', 4)->sole()['id'];

        // ensure there is always at least one eligible user
        $randomUser = User::whereNotIn('sub', ['admin@test.com'])->first();
        $randomUser->expectedClassifications()->sync([$it04Id]);
        $randomUser->cmoAssets()->sync([$appDevId, $appTestingId]);
        $randomUser->save();

        $eligibleUsers = User::whereHas('cmoAssets', function($query) use ($appDevId, $appTestingId) {
                                $query->where('cmo_assets.id', $appDevId)
                                    ->orWhere('cmo_assets.id', $appTestingId);
                                })
                            ->where(function ($query) use ($it04Id) {
                                $query->whereJsonContains('expected_salary', '_100K_PLUS')
                                        ->orWhereHas('expectedClassifications', function($query) use ($it04Id)  {
                                            $query->where('classifications.id', $it04Id);
                                        });
                                })
                            ->get(); // :grimacing

        //
        // execute commands
        //
        $this->artisan('create:digital_careers_pools')->assertSuccessful();
        $this->artisan('create:new_digital_pool_candidates')->assertSuccessful();

        // grab candidates placed into IT-04 POOL_STREAM_SOFTWARE_SOLUTIONS
        $it04SoftwareSolutionsPoolId = Pool::where('stream', 'ilike', ApiEnums::POOL_STREAM_SOFTWARE_SOLUTIONS)
                            ->whereHas('classifications', function($query) {
                                $query->where('group', 'ilike', 'IT')
                                        ->where('level', 4);
                                })
                            ->sole()['id'];
        $candidates = PoolCandidate::where('pool_id', $it04SoftwareSolutionsPoolId)->get();

        //
        // main assertions
        //

        // assert eligible users for the testing pool equals number of candidates placed into that pool
        assertEquals(count($eligibleUsers), count($candidates));

        // assert the above do not equal zero
         assertGreaterThan(0, count($candidates));
    }

    /**
     * testing api\app\Console\Commands\ExpireOldDigitalCareersPoolCandidates.php
     */
    public function testRunningArtisanCandidateExpiring()
    {
        //
        // repeat set-up environment from above
        //

        $faker = Faker\Factory::create();
        $this->artisan('db:seed --class=ClassificationSeeder');
        $this->artisan('db:seed --class=CmoAssetSeeder');
        $this->artisan('db:seed --class=SkillFamilySeeder');
        $this->artisan('db:seed --class=SkillSeeder');
        $this->artisan('db:seed --class=SkillSeeder');
        $owner = User::where('sub', 'ilike', 'admin@test.com')->sole();
        $oldDigitalPool = Pool::factory()->create([
            'user_id' => $owner['id'],
            'name' => [
                'en' => 'CMO Digital Careers',
                'fr' => 'CMO Carrières Numériques'
            ],
            'key' => 'digital_careers',
        ]);
        User::factory([
            'roles' => [ApiEnums::ROLE_APPLICANT]
        ])
            ->count(15)
            ->afterCreating(function (User $user) use ($faker) {
                $assets = CmoAsset::inRandomOrder()->limit(4)->pluck('id')->toArray();
                $user->cmoAssets()->sync($assets);
                $digitalTalentPool = Pool::where('key', "digital_careers")->first();
                if (rand(0, 1)) {
                    $classification = Classification::inRandomOrder()->limit(1)->pluck('id')->toArray();
                    $user->expectedClassifications()->sync($classification);
                    $user->expected_salary = [];
                    $user->save();
                } else {
                    $user->expected_salary = $faker->randomElements(ApiEnums::salaryRanges(), 2);
                    $user->save();
                    $user->expectedClassifications()->sync([]);
                }
                PoolCandidate::factory()->count(1)->sequence(fn () => [
                    'pool_id' => $digitalTalentPool->id,
                    'user_id' => $user->id,
                ])->create();
            })
        ->create();

        //
        // testing phase
        //

        // collect count of candidates in pool
        $poolCandidates = PoolCandidate::all();
        $poolCandidatesCount = count($poolCandidates);

        // run command
        $this->artisan('expire:old_digital_pool_candidates')->assertSuccessful();

        // grab expired candidates
        $expiredCandidates = PoolCandidate::where('pool_candidate_status', ApiEnums::CANDIDATE_STATUS_EXPIRED)->get();
        $expiredCandidatesCount = count($expiredCandidates);

        // assertions
        // assert 15 candidates present in the pool before the command was run
        assertEquals(15, $poolCandidatesCount);

        // assert 15 expired candidates exist
        assertEquals(15, $expiredCandidatesCount);
    }

    /**
     * testing api\app\Console\Commands\UpdateEmailsOfNoLoginUsers.php
     */
    public function testRunningArtisanUpdateEmailsOfObsoleteUsers()
    {
        // this command will update admin and other test users with sub == email
        $user1 = User::factory()->create([
            'email' => 'email@email.com',
            'sub' => 'email@email.com',
        ]);
        $user2 = User::factory()->create([
            'email' => 'amail@amail.com',
            'sub' => '2f3ee3fb-91ab-478e-a675-c56fdc043dc6',
        ]);
        $user3 = User::factory()->create([
            'email' => 'bmail@bmail.com',
            'sub' => null,
        ]);

        // run the command
        $this->artisan('update:obsolete_user_email')->assertSuccessful();
        // added tag is "+admin_entry"

        // assert user1 is still returned as the sole result for that sub
        // assert user1 email is updated
        $user1Updated = User::where('sub', 'ilike', 'email@email.com')->sole();
        assertEquals($user1Updated->email, "email+admin_entry@email.com");

        // assert user2 is still returned as the sole result for that sub
        // assert user2 email is unchanged
        $user2Updated = User::where('sub', '2f3ee3fb-91ab-478e-a675-c56fdc043dc6')->sole();
        assertEquals($user2Updated->email, $user2->email);

        // assert user3 is returned for the expected updated email
        // assert user3 sub is still null
        $user3Updated = User::where('email', 'ilike', 'bmail+admin_entry@bmail.com')->sole();
        assertEquals($user3Updated->sub, $user3->sub);
    }
}
