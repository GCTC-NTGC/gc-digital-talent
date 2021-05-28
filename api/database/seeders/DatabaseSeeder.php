<?php

namespace Database\Seeders;

use App\Models\Pool;
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
        $this->call(ClassificationSeeder::class);
        $this->call(CmoAssetSeeder::class);
        $this->call(OperationalRequirementSeeder::class);

        $this->call(UserSeeder::class);
        Pool::factory()->count(2)->create();
    }
}
