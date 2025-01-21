<?php

namespace Database\Seeders;

use App\Models\TrainingOpportunity;
use Illuminate\Database\Seeder;

class TrainingOpportunityRandomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TrainingOpportunity::factory()->count(20)->create();
    }
}
