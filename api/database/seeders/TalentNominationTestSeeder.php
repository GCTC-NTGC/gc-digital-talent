<?php

namespace Database\Seeders;

use App\Models\TalentNomination;
use Illuminate\Database\Seeder;

class TalentNominationTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        TalentNomination::factory()
            ->count(3)
            ->noSubmittedSteps()
            ->create();

        TalentNomination::factory()
            ->count(3)
            ->submittedInstructions()
            ->create();

        TalentNomination::factory()
            ->count(3)
            ->submittedNominatorInformation()
            ->create();

    }
}
