<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ProdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(ClassificationSeeder::class);
        $this->call(DepartmentSeeder::class);
        $this->call(SkillFamilySeeder::class);
        $this->call(SkillSeeder::class);
    }
}
