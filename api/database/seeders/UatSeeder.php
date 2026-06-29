<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class UatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Note: to manually promote a user to admin, refer to instructions in documentation/authentication.md.
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
