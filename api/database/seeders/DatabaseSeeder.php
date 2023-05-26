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
use App\Models\Team;
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

        // seed a test team and random teams
        Team::factory()->create([
            'name' => 'test-team',
            'display_name' => [
                'en' => 'Test Team',
                'fr' => 'Équipe de test',
            ],
        ]);
        Team::factory()->count(9)->create();

        $this->call(RolePermissionSeeder::class);
        $this->call(ClassificationSeeder::class);
        $this->call(DepartmentSeeder::class);
        $this->call(GenericJobTitleSeeder::class);
        $this->call(SkillFamilySeeder::class);
        $this->call(SkillSeeder::class);
        $this->call(TeamSeeder::class);
        $this->call(UserSeederLocal::class);
        $this->call(PoolSeeder::class);

        // Seed random pools
        Pool::factory()->count(2)->draft()->create();
        Pool::factory()->count(6)->published()->create();
        Pool::factory()->count(2)->closed()->create();
        // Seed some expected values
        $this->seedPools();

        $digitalTalentPool = Pool::where('key', "digital_careers")->sole();

        User::factory([
            'legacy_roles' => [ApiEnums::LEGACY_ROLE_APPLICANT]
        ])
            ->count(150)
            ->afterCreating(function (User $user) use ($faker, $digitalTalentPool) {

                $genericJobTitles = GenericJobTitle::inRandomOrder()->limit(2)->pluck('id')->toArray();
                $user->expectedGenericJobTitles()->sync($genericJobTitles);

                // pick a published pool in which to place this user
                // temporarily rig seeding to be biased towards slotting pool candidates into Digital Talent
                // digital careers is always published and strictly defined in PoolSeeder
                $randomPool = Pool::whereNotNull('published_at')->inRandomOrder()->first();
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

                // create a pool candidate in the pool - are they suspended?
                if (rand(0, 4) == 4) {
                    $this->seedSuspendedCandidate($user, $pool);
                } else {
                    $this->seedPoolCandidate($user, $pool);
                }
            })
            ->create();

        // applicant@test.com bespoke seeding
        $applicant = User::where('sub', 'applicant@test.com')->sole();
        $pool = Pool::whereNotNull('published_at')->inRandomOrder()->first();
        $this->seedPoolCandidate($applicant, $pool);
        $this->seedAwardExperienceForPool($applicant, $digitalTalentPool);

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
                ->count($faker->biasedNumberBetween($min = 1, $max = 3, $function = 'Faker\Provider\Biased::linearLow'))
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
                ->count($faker->biasedNumberBetween($min = 1, $max = 3, $function = 'Faker\Provider\Biased::linearLow'))
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

        // attach either a work or education experience to a pool candidate to meet minimum criteria
        PoolCandidate::all()->load('user')->each(function ($poolCandidate) {
            $educationRequirementOption = $poolCandidate->education_requirement_option;
            $user = $poolCandidate->user;

            if ($educationRequirementOption === ApiEnums::EDUCATION_REQUIREMENT_OPTION_EDUCATION) {
                $educationExperience = $user->educationExperiences()->first();
                $poolCandidate->educationRequirementEducationExperiences()->sync([$educationExperience->id]);
            } else if ($educationRequirementOption === ApiEnums::EDUCATION_REQUIREMENT_OPTION_APPLIED_WORK) {
                $workExperience = $user->workExperiences()->first();
                $poolCandidate->educationRequirementWorkExperiences()->sync([$workExperience->id]);
            }
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
        Pool::truncate();
        Team::truncate();
    }

    private function seedPoolCandidate(User $user, Pool $pool)
    {
        // create a pool candidate in the pool
        PoolCandidate::factory()->for($user)->for($pool)
            ->afterCreating(function (PoolCandidate $candidate) {
                if ($candidate->submitted_at) {
                    $candidate->createSnapshot();
                }
            })
            ->create();
    }

    private function seedAwardExperienceForPool(User $user, Pool $pool)
    {
        // attach an award experience to a given user that has all the essential skills of a given pool
        $faker = Faker\Factory::create();
        $essentialSkillIds = $pool->essentialSkills()->pluck('id')->toArray();

        if (isset($essentialSkillIds) && count($essentialSkillIds) > 0) {
            $data = array_map(function () use ($faker) {
                return ['details' => $faker->text()];
            }, array_flip($essentialSkillIds)); // flip array from [index => 'id'], need id as keys

            AwardExperience::factory()->for($user)
                ->afterCreating(function ($model) use ($data) {
                    $model->skills()->sync($data);
                })->create();
        }
    }

    private function seedSuspendedCandidate(User $user, Pool $pool)
    {
        // create a suspended pool candidate in the pool
        PoolCandidate::factory()->suspended()->for($user)->for($pool)
            ->afterCreating(function (PoolCandidate $candidate) {
                if ($candidate->submitted_at) {
                    $candidate->createSnapshot();
                }
            })
            ->create();
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

        $testTeamId = Team::where('name', 'test-team')->sole()['id'];

        foreach ($classifications as $classification) {
            foreach ($publishingGroups as $publishingGroup) {
                foreach ($dates as $date) {
                    Pool::factory()->published()->afterCreating(function ($pool) use ($classification, $faker) {
                        $pool->classifications()->sync([$classification->id]);
                    })->create([
                        'closing_date' => $date,
                        'publishing_group' => $publishingGroup,
                        'published_at' => $faker->dateTimeBetween('-1 year', 'now'),
                        'stream' => $faker->randomElement(ApiEnums::poolStreams()),
                        'team_id' => $testTeamId,
                    ]);
                }
            }
        }
    }
}
