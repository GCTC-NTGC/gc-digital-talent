<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\DigitalContractingQuestionnaire;

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
