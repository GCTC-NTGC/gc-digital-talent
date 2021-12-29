<?php

namespace Database\Seeders;

use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\PoolCandidateSearchRequest;
use App\Models\Skill;
use App\Models\SkillCategory;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

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

        $this->call(SkillCategoryGroupSeeder::class);
        $this->call(SkillCategorySeeder::class);
        Skill::factory()
            ->count(20)
            ->state(new Sequence(
                fn () => ['skill_category_id' => SkillCategory::inRandomOrder()->first()->id],
            ))
            ->create();
    }

    // drop all rows from some tables so that the seeder can fill them fresh
    private function truncateTables()
    {
        Skill::truncate();
    }
}
