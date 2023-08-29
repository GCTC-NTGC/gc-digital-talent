<?php

namespace Database\Seeders;

use App\Models\DigitalContractingQuestionnaire;
use Illuminate\Database\Seeder;

class DigitalContractingQuestionnaireSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DigitalContractingQuestionnaire::factory()->count(10)->create();
    }
}
