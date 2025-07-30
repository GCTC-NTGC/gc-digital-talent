<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ProdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            ClassificationSeeder::class,
            DepartmentSeeder::class,
            GenericJobTitleSeeder::class,
            SkillFamilySeeder::class,
            SkillSeeder::class,
            CommunitySeeder::class,
            WorkStreamSeeder::class,
            DevelopmentProgramSeeder::class,
            JobPosterTemplateSeeder::class,
        ]);
    }
}
