<?php

namespace Database\Seeders;

use App\Models\TalentNomination;
use App\Models\User;
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
        $admin = User::where('sub', 'admin@test.com')->sole();

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

        TalentNomination::factory()
            ->count(3)
            ->submittedNomineeInformation()
            ->create();

        TalentNomination::factory()
            ->count(3)
            ->submittedNominationDetails()
            ->create();

        TalentNomination::factory()
            ->count(3)
            ->submittedRationale()
            ->create();

        TalentNomination::factory()
            ->count(3)
            ->submittedReviewAndSubmit()
            ->create();

        // seed some to a specific user
        TalentNomination::factory()
            ->count(1)
            ->noSubmittedSteps()
            ->create([
                'submitter_id' => $admin->id,
            ]);
        TalentNomination::factory()
            ->count(1)
            ->submittedReviewAndSubmit()
            ->create([
                'submitter_id' => $admin->id,
            ]);
    }
}
