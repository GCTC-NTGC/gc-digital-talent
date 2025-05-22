<?php

namespace Database\Seeders;

use App\Models\TalentNomination;
use App\Models\TalentNominationEvent;
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
        $employee = User::where('sub', 'applicant-employee@test.com')->sole();
        $talentNominationEvent = TalentNominationEvent::where('name','ILIKE','%'. 'test talent nomination event active en'. '%')->first();

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

        TalentNomination::factory()
            ->count(1)
            ->submittedReviewAndSubmit()
            ->create([
                'talent_nomination_event_id' => $talentNominationEvent->id,
                'submitter_id' => $admin->id,
                'nominee_id' => $employee->id,
                'nominate_for_advancement' => true,
                'nominate_for_lateral_movement' => true,
                'nominate_for_development_programs' => false,
        ]);
    }
}
