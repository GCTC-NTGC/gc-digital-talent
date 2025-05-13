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
        // Note: to manually promote a Sign In Canada user to admin, refer to instructions in documentation/sign-in-canada.md.
        $this->call([
            RolePermissionSeeder::class,
            ClassificationSeeder::class,
            DepartmentSeeder::class,
            GenericJobTitleSeeder::class,
            SkillFamilySeeder::class,
            SkillSeeder::class,
            JobPosterTemplateSeeder::class,
        ]);
    }
}
