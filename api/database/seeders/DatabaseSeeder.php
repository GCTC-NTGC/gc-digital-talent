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
        $this->call(UserSeeder::class);
        Pool::factory()->count(2)->create();
    }
}
