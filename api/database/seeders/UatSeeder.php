<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Database\Helpers\ApiEnums;
use App\Models\User;
use App\Models\Pool;
use App\Models\Classification;
use App\Models\CmoAsset;
use App\Models\PoolCandidate;
use App\Models\Skill;
use App\Models\SkillFamily;
use App\Models\AwardExperience;
use App\Models\CommunityExperience;
use App\Models\EducationExperience;
use App\Models\GenericJobTitle;
use App\Models\PersonalExperience;
use App\Models\WorkExperience;

class UatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->truncateTables();

        $this->call(ClassificationSeeder::class);
        $this->call(CmoAssetSeeder::class);
        $this->call(DepartmentSeeder::class);
        $this->call(UserSeederUat::class);
        $this->call(PoolSeederUat::class);
        $this->call(SkillSeeder::class);
        $this->call(GenericJobTitleSeeder::class);

        User::factory([
        'roles' => [ApiEnums::ROLE_APPLICANT]
        ])
        ->count(150)
        ->afterCreating(function (User $user) {
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
                    $pool->classifications()->pluck('classifications.id')->toArray()
                );
            } else {
                // non-government users have no current classification or expected classifications but have salary
                $user->current_classification = null;
                $user->expected_salary = array_rand(array_flip(ApiEnums::salaryRanges()), 3);
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
        User::all()->each(function($user) {
            AwardExperience::factory()
            ->count(rand(0,3))
            ->for($user)
            ->afterCreating(function ($model) {
                $skills = Skill::inRandomOrder()->limit(3)->pluck('id')->toArray();
                $data = [
                    $skills[0] => ['details' => 'skill one'],
                    $skills[1] => ['details' => 'skill two'],
                    $skills[2] => ['details' => 'skill three'],
                ];
                $model->skills()->sync($data);
            })->create();
            CommunityExperience::factory()
            ->count(rand(0,3))
            ->for($user)
            ->afterCreating(function ($model) {
                $skills = Skill::inRandomOrder()->limit(3)->pluck('id')->toArray();
                $data = [
                    $skills[0] => ['details' => 'skill one'],
                    $skills[1] => ['details' => 'skill two'],
                    $skills[2] => ['details' => 'skill three'],
                ];
                $model->skills()->sync($data);
            })->create();
            EducationExperience::factory()
            ->count(rand(0,3))
            ->for($user)
            ->afterCreating(function ($model) {
                $skills = Skill::inRandomOrder()->limit(3)->pluck('id')->toArray();
                $data = [
                    $skills[0] => ['details' => 'skill one'],
                    $skills[1] => ['details' => 'skill two'],
                    $skills[2] => ['details' => 'skill three'],
                ];
                $model->skills()->sync($data);
            })->create();
            PersonalExperience::factory()
            ->count(rand(0,3))
            ->for($user)
            ->afterCreating(function ($model) {
                $skills = Skill::inRandomOrder()->limit(3)->pluck('id')->toArray();
                $data = [
                    $skills[0] => ['details' => 'skill one'],
                    $skills[1] => ['details' => 'skill two'],
                    $skills[2] => ['details' => 'skill three'],
                ];
                $model->skills()->sync($data);
            })->create();
            WorkExperience::factory()
            ->count(rand(0,3))
            ->for($user)
            ->afterCreating(function ($model) {
                $skills = Skill::inRandomOrder()->limit(3)->pluck('id')->toArray();
                $data = [
                    $skills[0] => ['details' => 'skill one'],
                    $skills[1] => ['details' => 'skill two'],
                    $skills[2] => ['details' => 'skill three'],
                ];
                $model->skills()->sync($data);
            })->create();
        });
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
        User::truncate();
    }
}
