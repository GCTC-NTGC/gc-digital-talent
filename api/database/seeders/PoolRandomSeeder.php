<?php

namespace Database\Seeders;

use App\Models\Pool;
use Illuminate\Database\Seeder;

class PoolRandomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Pool::factory()->draft()->create();
        Pool::factory()->count(3)->published()->withAssessmentSteps(3)->create();
        Pool::factory()->closed()->create();
        Pool::factory()->archived()->create();
    }
}
