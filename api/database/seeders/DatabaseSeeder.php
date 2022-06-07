<?php

namespace Database\Seeders;

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
use App\Models\PersonalExperience;
use App\Models\WorkExperience;
use Faker;
use Illuminate\Cache\RateLimiting\Limit;
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

        SkillFamily::factory()
            ->count(10)
            ->create();
        Skill::factory()
            ->count(40)
            ->afterCreating(function ($model) {
                $families = SkillFamily::inRandomOrder()->limit(3)->pluck('id')->toArray();
                $model->families()->sync($families);
            })
            ->create();

        $this->call(UserSeederLocal::class);
        $this->call(PoolSeeder::class);


        // fill digital_careers no salary, with classifications
        // first 5 classifications in ClassificationSeeder are IT group, therefore take(5) grabs the five IT classifications
        User::factory([
            'roles' => [ApiEnums::ROLE_APPLICANT]
       ])
            ->count(20)
            ->afterCreating(function (User $user) {
                $assets = CmoAsset::inRandomOrder()->limit(4)->pluck('id')->toArray();
                $classifications = Classification::take(5)->inRandomOrder()->limit(3)->get()->pluck('id')->toArray();
                $user->cmoAssets()->sync($assets);
                $user->expectedClassifications()->sync($classifications);
                PoolCandidate::factory()->count(1)->sequence(fn () => [
                    'pool_id' => Pool::pluck('id', 'key')->toArray()['digital_careers'],
                    'expected_salary' => null
                ])->for($user)->afterCreating(function (PoolCandidate $candidate){
                        $classifications = Classification::take(5)->inRandomOrder()->limit(3)->get();
                        $candidate->expectedClassifications()->saveMany($classifications);
                        $assets = CmoAsset::inRandomOrder()->limit(4)->get();
                        $candidate->cmoAssets()->saveMany($assets);
                    })->create();
            })
            ->create();
        // fill digital_careers salary, no classifications
        User::factory([
            'roles' => [ApiEnums::ROLE_APPLICANT]
       ])
            ->count(20)
            ->afterCreating(function (User $user) {
                $assets = CmoAsset::inRandomOrder()->limit(4)->pluck('id')->toArray();
                $user->cmoAssets()->sync($assets);
                PoolCandidate::factory()->count(1)->sequence(fn () => [
                    'pool_id' => Pool::pluck('id', 'key')->toArray()['digital_careers'],
                ])->for($user)->afterCreating(function (PoolCandidate $candidate){
                    $assets = CmoAsset::inRandomOrder()->limit(4)->get();
                    $candidate->cmoAssets()->saveMany($assets);
                })->create();
            })
            ->create();

        // fill indigenous talent pool - classifications only
        // INCOMPLETE?
        User::factory([
            'roles' => [ApiEnums::ROLE_APPLICANT]
       ])
        ->count(20)
        ->afterCreating(function (User $user) {
            $assets = CmoAsset::inRandomOrder()->limit(4)->pluck('id')->toArray();
            $classifications = Classification::take(5)->inRandomOrder()->limit(3)->get()->pluck('id')->toArray();
            $user->cmoAssets()->sync($assets);
            $user->expectedClassifications()->sync($classifications);
            PoolCandidate::factory()->count(1)->sequence(fn () => [
                'pool_id' => Pool::pluck('id', 'key')->toArray()['indigenous_apprenticeship'],
                'expected_salary' => null
            ])->for($user)->afterCreating(function (PoolCandidate $candidate){
                $classifications = Classification::take(5)->inRandomOrder()->limit(3)->get();
                $candidate->expectedClassifications()->saveMany($classifications);
                $assets = CmoAsset::inRandomOrder()->limit(4)->get();
                $candidate->cmoAssets()->saveMany($assets);
            })->create();
        })
        ->create();
        // fill indigenous talent pool - salary only
        User::factory([
            'roles' => [ApiEnums::ROLE_APPLICANT]
       ])
        ->count(20)
        ->afterCreating(function (User $user) {
            $assets = CmoAsset::inRandomOrder()->limit(4)->pluck('id')->toArray();
            $user->cmoAssets()->sync($assets);
            PoolCandidate::factory()->count(1)->sequence(fn () => [
                'pool_id' => Pool::pluck('id', 'key')->toArray()['indigenous_apprenticeship'],
            ])->for($user)->afterCreating(function (PoolCandidate $candidate){
                $assets = CmoAsset::inRandomOrder()->limit(4)->get();
                $candidate->cmoAssets()->saveMany($assets);
            })->create();
        })
        ->create();

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
