<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            // standard platform data
            RolePermissionSeeder::class,
            ClassificationSeeder::class,
            DepartmentSeeder::class,
            GenericJobTitleSeeder::class,
            SkillFamilySeeder::class,
            SkillSeeder::class,
            CommunitySeeder::class,
            WorkStreamSeeder::class,
            JobPosterTemplateSeeder::class,

            // convenient test data
            CommunityTestSeeder::class,
            TalentNominationEventTestSeeder::class,
            UserTestSeeder::class,
            TalentNominationTestSeeder::class,
            PoolTestSeeder::class,
            PoolCandidateTestSeeder::class,
            AssessmentResultTestSeeder::class,
        ]);
    }
}
