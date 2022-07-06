<?php

namespace Database\Seeders;

use App\Models\ApplicantFilter;
use App\Models\User;
use App\Models\Pool;
use App\Models\Classification;
use App\Models\CmoAsset;
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
        $this->call(CmoAssetSeeder::class);
        $this->call(DepartmentSeeder::class);
        $this->call(GenericJobTitleSeeder::class);
        $this->call(SkillSeeder::class);
        $this->call(UserSeederLocal::class);
        $this->call(PoolSeeder::class);

        User::factory([
            'roles' => [ApiEnums::ROLE_APPLICANT]
        ])
            ->count(120)
            ->afterCreating(function (User $user) use ($faker) {
                $assets = CmoAsset::inRandomOrder()->limit(4)->pluck('id')->toArray();
                $user->cmoAssets()->sync($assets);

                $genericJobTitles = GenericJobTitle::inRandomOrder()->limit(2)->pluck('id')->toArray();
                $user->expectedGenericJobTitles()->sync($genericJobTitles);

                // pick a pool in which to place this user
                $pool = Pool::inRandomOrder()->limit(1)->first();

                // are they a government user?
                if(rand(0, 1)) {
                    // government users have a current classification and expected classifications but no salary
                    $user->current_classification = Classification::inRandomOrder()->first()->id;
                    $user->expected_salary = [];
                    $user->save();

                    $user->expectedClassifications()->sync(
                        $faker->randomElements($pool->classifications()->pluck('classifications.id')->toArray(), 3)
                    );
                } else {
                    // non-government users have no current classification or expected classifications but have salary
                    $user->current_classification = null;
                    $user->expected_salary = $faker->randomElements(ApiEnums::salaryRanges(), 3);
                    $user->save();

                    $user->expectedClassifications()->sync([]);
                }

                // create a pool candidate in the pool
                PoolCandidate::factory()->count(1)->sequence(fn () => [
                    'pool_id' => $pool->id,
                    'user_id' => $user->id,
                    'expected_salary' => $user->expected_salary
                ])->for($user)->afterCreating(function (PoolCandidate $candidate) use ($user) {
                    // match arrays from the user
                    $candidate->expectedClassifications()->sync($user->expectedClassifications()->pluck('classifications.id')->toArray());
                    $candidate->cmoAssets()->sync($user->cmoAssets()->pluck('cmo_assets.id')->toArray());

                })->create();
            })
            ->create();

        // add experiences to all the users
        User::all()->each(function($user) use ($faker) {
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

        ApplicantFilter::factory()->sparse()->withRelationships(true)->count(10)->create();

        PoolCandidateSearchRequest::factory()->count(10)->create();
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
}
