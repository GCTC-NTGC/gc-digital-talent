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
        $this->call(RolePermissionSeeder::class);
        $this->call(ClassificationSeeder::class);
        $this->call(DepartmentSeeder::class);
        $this->call(GenericJobTitleSeeder::class);
        $this->call(SkillFamilySeeder::class);
        $this->call(SkillSeeder::class);
        $this->call(TeamSeeder::class);
        $this->call(UserSeederLocal::class);
    }
}
