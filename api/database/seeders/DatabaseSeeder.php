<?php

namespace Database\Seeders;

use App\Models\ApplicantFilter;
use App\Models\User;
use App\Models\Pool;
use App\Models\Classification;
use App\Models\PoolCandidate;
use App\Models\PoolCandidateFilter;
use App\Models\PoolCandidateSearchRequest;
use App\Models\Skill;
use App\Models\SkillFamily;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\AwardExperience;
use App\Models\CommunityExperience;
use App\Models\EducationExperience;
use App\Models\GenericJobTitle;
use App\Models\PersonalExperience;
use App\Models\WorkExperience;
use Faker;
use Database\Helpers\ApiEnums;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker\Factory::create();


        $this->truncateTables();

        $this->call(ClassificationSeeder::class);
        $this->call(DepartmentSeeder::class);
        $this->call(GenericJobTitleSeeder::class);
        $this->call(SkillFamilySeeder::class);
        $this->call(SkillSeeder::class);
        $this->call(UserSeederLocal::class);
        $this->call(PoolSeeder::class);

        // Seed random pools
        Pool::factory()->count(10)->create();
        // Seed some expected values
        $this->seedPools();

        User::factory([
            'roles' => [ApiEnums::ROLE_APPLICANT]
        ])
            ->count(150)
            ->afterCreating(function (User $user) use ($faker) {

                $genericJobTitles = GenericJobTitle::inRandomOrder()->limit(2)->pluck('id')->toArray();
                $user->expectedGenericJobTitles()->sync($genericJobTitles);

                // pick a published pool in which to place this user
                // temporarily rig seeding to be biased towards slotting pool candidates into Digital Talent
                // digital careers is always published and strictly defined in PoolSeeder
                $randomPool = Pool::whereNotNull('published_at')->inRandomOrder()->first();
                $digitalTalentPool = Pool::where('key', "digital_careers")->first();
                $pool = $faker->boolean(25) ? $digitalTalentPool : $randomPool;

                // are they a government user?
                if (rand(0, 1)) {
                    // government users have a current classification and expected classifications but no salary
                    $classification = Classification::inRandomOrder()->limit(1)->pluck('id')->toArray();
                    $user->expectedClassifications()->sync($classification);
                    $user->expected_salary = [];
                    $user->save();

                    $user->expectedClassifications()->sync(
                        $pool->classifications()->pluck('classifications.id')->toArray()
                    );
                } else {
                    // non-government users have no current classification or expected classifications but have salary
                    $user->current_classification = null;
                    $user->expected_salary = $faker->randomElements(ApiEnums::salaryRanges(), 2);
                    $user->save();

                    $user->expectedClassifications()->sync([]);
                }

                // create a pool candidate in the pool
                $this->seedPoolCandidate($user, $pool);
            })
            ->create();

        $applicant = User::where('email', 'applicant@test.com')->first();
        $pool = Pool::whereNotNull('published_at')->inRandomOrder()->first();
        $this->seedPoolCandidate($applicant, $pool);

        // add experiences to all the users
        User::all()->each(function ($user) use ($faker) {
            AwardExperience::factory()
                ->count($faker->biasedNumberBetween($min = 0, $max = 3, $function = 'Faker\Provider\Biased::linearLow'))
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
            CommunityExperience::factory()
                ->count($faker->biasedNumberBetween($min = 0, $max = 3, $function = 'Faker\Provider\Biased::linearLow'))
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
            EducationExperience::factory()
                ->count($faker->biasedNumberBetween($min = 0, $max = 3, $function = 'Faker\Provider\Biased::linearLow'))
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
            PersonalExperience::factory()
                ->count($faker->biasedNumberBetween($min = 0, $max = 3, $function = 'Faker\Provider\Biased::linearLow'))
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
            WorkExperience::factory()
                ->count($faker->biasedNumberBetween($min = 0, $max = 3, $function = 'Faker\Provider\Biased::linearLow'))
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

        // Create some SearchRequests with old filters, some with new.
        PoolCandidateSearchRequest::factory()->count(5)->create([
            'applicant_filter_id' => null
        ]);
        PoolCandidateSearchRequest::factory()->count(5)->create([
            'pool_candidate_filter_id' => null,
            'applicant_filter_id' => ApplicantFilter::factory()->sparse()->withRelationships(true)
        ]);
    }

    // drop all rows from some tables so that the seeder can fill them fresh
    private function truncateTables()
    {
        AwardExperience::truncate();
        CommunityExperience::truncate();
        EducationExperience::truncate();
        PersonalExperience::truncate();
        WorkExperience::truncate();
        SkillFamily::truncate();
        Skill::truncate();
        DB::table('skill_skill_family')->truncate();
        PoolCandidateFilter::truncate();
        PoolCandidateSearchRequest::truncate();
        User::truncate();
    }

    private function seedPoolCandidate(User $user, Pool $pool)
    {
        // create a pool candidate in the pool
        PoolCandidate::factory()->count(1)->sequence(fn () => [
            'pool_id' => $pool->id,
            'user_id' => $user->id,
        ])->for($user)->afterCreating(function (PoolCandidate $candidate) {
            if ($candidate->submitted_at) {
                $candidate->createSnapshot();
            }
        })->create();
    }

    private function seedPools()
    {
        $faker = Faker\Factory::create();

        $publishingGroups = [
            ApiEnums::PUBLISHING_GROUP_IT_JOBS,
            ApiEnums::PUBLISHING_GROUP_IT_JOBS_ONGOING
        ];
        $dates = [
            'FAR_PAST' => Carbon::create(1992, 10, 24),
            'FAR_FUTURE' => Carbon::create(2999, 10, 24)
        ];

        $classifications = Classification::where('group', 'IT')
            ->where('level', '<', 5)
            ->get();

        foreach ($classifications as $classification) {
            foreach ($publishingGroups as $publishingGroup) {
                foreach ($dates as $date) {
                    Pool::factory()->afterCreating(function ($pool) use ($classification, $faker) {
                        $pool->classifications()->sync([$classification->id]);
                    })->create([
                        'closing_date' => $date,
                        'publishing_group' => $publishingGroup,
                        'published_at' => $faker->dateTimeBetween('-1 year', 'now')
                    ]);
                }
            }
        }
    }
}
