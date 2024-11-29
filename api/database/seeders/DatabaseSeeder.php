<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // to reset the database before running this, run `php artisan migrate:fresh`

        $this->call([
            // standard platform data
            RolePermissionSeeder::class, ClassificationSeeder::class,
            DepartmentSeeder::class,
            GenericJobTitleSeeder::class,
            SkillFamilySeeder::class,
            SkillSeeder::class,
            CommunitySeeder::class,
            WorkStreamSeeder::class,
            TeamSeeder::class,
            JobPosterTemplateSeeder::class,

            // convenient test data
            UserTestSeeder::class,
            PoolTestSeeder::class,
            PoolCandidateTestSeeder::class,
            AssessmentResultTestSeeder::class,

            // random data to fill it out
            TeamRandomSeeder::class,
            PoolRandomSeeder::class,
            UserRandomSeeder::class,
            AssessmentResultRandomSeeder::class,
            SearchRequestRandomSeeder::class,
            DigitalContractingQuestionnaireRandomSeeder::class,
            DepartmentSpecificRecruitmentProcessFormRandomSeeder::class,
            TrainingOpportunityRandomSeeder::class,
        ]);
    }
}
