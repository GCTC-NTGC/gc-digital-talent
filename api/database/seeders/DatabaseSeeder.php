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
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\AwardExperience;
use App\Models\CommunityExperience;
use App\Models\EducationExperience;
use App\Models\PersonalExperience;
use App\Models\WorkExperience;
use Faker;

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

        User::factory()
            ->count(60)
            ->sequence(fn () => [
                'current_classification' => Classification::inRandomOrder()->first()->id,
            ])
            ->afterCreating(function (User $user) {
                $assets = CmoAsset::inRandomOrder()->limit(4)->pluck('id')->toArray();
                $classifications = Classification::inRandomOrder()->limit(3)->pluck('id')->toArray();
                $user->cmoAssets()->sync($assets);
                $user->expectedClassifications()->sync($classifications);
            })
            ->create();

        User::all()->each(function($user) use ($faker) {
            PoolCandidate::factory()->count(1)->sequence(fn () => [
                'pool_id' => Pool::inRandomOrder()->first()->id,
            ])->for($user)->create();
            AwardExperience::factory()->count($faker->biasedNumberBetween($min = 0, $max = 3,
                $function = 'Faker\Provider\Biased::linearLow'))->for($user)->create();
            CommunityExperience::factory()->count($faker->biasedNumberBetween($min = 0, $max = 3,
                $function = 'Faker\Provider\Biased::linearLow'))->for($user)->create();
            EducationExperience::factory()->count($faker->biasedNumberBetween($min = 0, $max = 3,
                $function = 'Faker\Provider\Biased::linearLow'))->for($user)->create();
            PersonalExperience::factory()->count($faker->biasedNumberBetween($min = 0, $max = 3,
                $function = 'Faker\Provider\Biased::linearLow'))->for($user)->create();
            WorkExperience::factory()->count($faker->biasedNumberBetween($min = 0, $max = 3,
                $function = 'Faker\Provider\Biased::linearLow'))->for($user)->create();
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
