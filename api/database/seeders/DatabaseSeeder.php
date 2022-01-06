<?php

namespace Database\Seeders;

use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\PoolCandidateSearchRequest;
use App\Models\Skill;
use App\Models\SkillFamily;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
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
        $this->call(OperationalRequirementSeeder::class);
        $this->call(DepartmentSeeder::class);

        $this->call(UserSeeder::class);
        $this->call(PoolSeeder::class);

        PoolCandidate::factory()
            ->count(60)
            ->state(new Sequence(
                fn () => ['pool_id' => Pool::inRandomOrder()->first()->id],
            ))
            ->create();

        PoolCandidateSearchRequest::factory()->count(10)->create();

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
    }

    // drop all rows from some tables so that the seeder can fill them fresh
    private function truncateTables()
    {
        SkillFamily::truncate();
        Skill::truncate();
        DB::table('skill_skill_family')->truncate();
        User::truncate();
    }
}
