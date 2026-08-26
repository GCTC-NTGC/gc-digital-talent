<?php

namespace Database\Seeders;

use App\Enums\TalentNominationGroupDecision;
use App\Models\TalentNomination;
use App\Models\TalentNominationEvent;
use App\Models\User;
use Illuminate\Database\Seeder;

class EmployeeProfileTalentNominationTestSeeder extends Seeder
{
    /**
     * Seed talent nominations tied to the applicant-employee test user so their
     * employee profile's "Nominations you've received" and "Employees you've
     * nominated" tabs have data to display.
     *
     * @return void
     */
    public function run()
    {
        $admin = User::where('sub', 'admin@test.com')->sole();
        $employee = User::where('sub', 'applicant-employee@test.com')->sole();
        $activeEvent = TalentNominationEvent::where('name', 'ILIKE', '%'.'test talent nomination event active en'.'%')->first();
        $pastEvent = TalentNominationEvent::where('name', 'ILIKE', '%'.'test talent nomination event past en'.'%')->first();

        // seed some approved nominations for the "Nominations you've received" tab on the employee's profile.
        // only shows approved nominations
        $receivedEvents = TalentNominationEvent::where('name', 'ILIKE', '%'.'test talent nomination event active en'.'%')
            ->whereKeyNot($activeEvent->id)
            ->take(3)
            ->get();

        $nominators = User::whereIn('sub', [
            'community@test.com',
            'recruiter@test.com',
            'process@test.com',
        ])->get();

        foreach ($receivedEvents as $index => $receivedEvent) {
            // give each group a single nomination type so the tab shows one
            // approved for development opportunities, one for lateral movement,
            // and one for advancement
            $nominateForAdvancement = $index === 2;
            $nominateForLateralMovement = $index === 1;
            $nominateForDevelopmentPrograms = $index === 0;

            $nominator = $nominators[$index % $nominators->count()];

            $nomination = TalentNomination::factory()
                ->submittedReviewAndSubmit()
                ->create([
                    'talent_nomination_event_id' => $receivedEvent->id,
                    'submitter_id' => $admin->id,
                    'nominator_id' => $nominator->id,
                    'nominator_fallback_name' => null,
                    'nominee_id' => $employee->id,
                    'nominate_for_advancement' => $nominateForAdvancement,
                    'nominate_for_lateral_movement' => $nominateForLateralMovement,
                    'nominate_for_development_programs' => $nominateForDevelopmentPrograms,
                ]);

            // Approve each nomination type that was actually requested so each
            // group ends up approved for the options it was nominated for.
            $group = $nomination->talentNominationGroup;
            if ($nominateForAdvancement) {
                $group->advancement_decision = TalentNominationGroupDecision::APPROVED->name;
            }
            if ($nominateForLateralMovement) {
                $group->lateral_movement_decision = TalentNominationGroupDecision::APPROVED->name;
            }
            if ($nominateForDevelopmentPrograms) {
                $group->development_programs_decision = TalentNominationGroupDecision::APPROVED->name;
            }
            $group->save();
        }

        // seed some nominations for the "Employees you've nominated". That tab shows nominations where the employee is
        // split into drafts vs submitted and open vs closed (by the event's close date).

        // a couple of drafts at different stages (open event)
        TalentNomination::factory()
            ->count(1)
            ->submittedInstructions()
            ->create([
                'talent_nomination_event_id' => $activeEvent->id,
                'submitter_id' => $employee->id,
            ]);
        TalentNomination::factory()
            ->count(1)
            ->submittedNominationDetails()
            ->create([
                'talent_nomination_event_id' => $activeEvent->id,
                'submitter_id' => $employee->id,
            ]);

        // a couple of submitted nominations on an open event
        TalentNomination::factory()
            ->count(2)
            ->submittedReviewAndSubmit()
            ->create([
                'talent_nomination_event_id' => $activeEvent->id,
                'submitter_id' => $employee->id,
            ]);

        // a submitted nomination on a closed/past event, so the open/closed toggle appears
        TalentNomination::factory()
            ->count(1)
            ->submittedReviewAndSubmit()
            ->create([
                'talent_nomination_event_id' => $pastEvent->id,
                'submitter_id' => $employee->id,
            ]);
    }
}
