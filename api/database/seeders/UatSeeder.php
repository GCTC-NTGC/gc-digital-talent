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
        $this->call(ClassificationSeeder::class);
        $this->call(DepartmentSeeder::class);
        $this->call(UserSeederUat::class);
        $this->call(PoolSeederUat::class);
    }
}
