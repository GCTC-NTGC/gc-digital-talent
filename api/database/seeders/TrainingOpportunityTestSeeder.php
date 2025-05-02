<?php

namespace Database\Seeders;

use App\Models\TrainingOpportunity;
use Illuminate\Database\Seeder;

class TrainingOpportunityTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TrainingOpportunity::factory()->registrationOpen()->create([
            'pinned' => true,
        ]);

        TrainingOpportunity::factory()->registrationOpen()->create([
            'pinned' => false,
        ]);
    }
}
