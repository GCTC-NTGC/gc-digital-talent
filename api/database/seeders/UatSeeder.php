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
        $this->call(RolePermissionSeeder::class);
        $this->call(ClassificationSeeder::class);
        $this->call(DepartmentSeeder::class);
        $this->call(GenericJobTitleSeeder::class);
        $this->call(SkillFamilySeeder::class);
        $this->call(SkillSeeder::class);
        $this->call(TeamSeeder::class);
        $this->call(PoolSeederUat::class);
    }
}
