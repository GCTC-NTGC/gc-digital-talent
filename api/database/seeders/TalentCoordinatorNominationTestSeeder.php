<?php

namespace Database\Seeders;

use App\Enums\TalentNominationGroupDecision;
use App\Models\Community;
use App\Models\TalentNomination;
use App\Models\TalentNominationEvent;
use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class TalentCoordinatorNominationTestSeeder extends Seeder
{
    /**
     * Seeds talent nomination data for the talent-coordinator@test.com user.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();
        $digital = Community::where('key', 'digital')->first();
        $coordinator = User::where('sub', 'talent-coordinator@test.com')->sole();

        $event = TalentNominationEvent::factory()
            ->withDevelopmentPrograms()
            ->create([
                'name' => [
                    'en' => 'Test Talent Coordinator Event active EN',
                    'fr' => 'Test Talent Coordinator Event active FR',
                ],
                'community_id' => $digital,
                'open_date' => $faker->dateTimeBetween('-1 year', 'now'),
                'close_date' => $faker->dateTimeBetween('+1 year', '+2 years'),
                'include_leadership_competencies' => true,
                'include_nine_box' => true,
            ]);

        // Seed a few nominations with a mix of advancement, lateral movement, and development.
        $selectionNominees = User::whereIsVerifiedGovEmployee()
            ->whereKeyNot($coordinator->id)
            ->inRandomOrder()
            ->take(10)
            ->get();

        foreach ($selectionNominees as $index => $nominee) {
            $nominateForAdvancement = $index % 3 === 0;
            $nominateForLateralMovement = $index % 3 === 1;
            $nominateForDevelopmentPrograms = $index % 3 === 2;

            TalentNomination::factory()
                ->submittedReviewAndSubmit()
                ->create([
                    'talent_nomination_event_id' => $event->id,
                    'nominee_id' => $nominee->id,
                    'nominate_for_advancement' => $nominateForAdvancement,
                    'nominate_for_lateral_movement' => $nominateForLateralMovement,
                    'nominate_for_development_programs' => $nominateForDevelopmentPrograms,
                ]);
        }

        // Seed a few nominations with a mix of approved and rejected
        $assessedNominees = User::whereIsVerifiedGovEmployee()
            ->whereKeyNot($coordinator->id)
            ->inRandomOrder()
            ->take(4)
            ->get();

        foreach ($assessedNominees as $index => $nominee) {
            $decision = $index % 2 === 0
                ? TalentNominationGroupDecision::APPROVED->name
                : TalentNominationGroupDecision::REJECTED->name;

            $nomination = TalentNomination::factory()
                ->submittedReviewAndSubmit()
                ->create([
                    'talent_nomination_event_id' => $event->id,
                    'nominee_id' => $nominee->id,
                    'nominate_for_advancement' => true,
                    'nominate_for_lateral_movement' => true,
                    'nominate_for_development_programs' => false,
                ]);

            $group = $nomination->talentNominationGroup;
            $group->advancement_decision = $decision;
            $group->lateral_movement_decision = $decision;
            $group->save();
        }

        // Seed a few nominations with a mix of advancement, lateral movement, and development
        // nominator being the same as the submitter, a separate nominator, and a fallback nominator.
        $sharedNominee = User::whereIsVerifiedGovEmployee()
            ->whereKeyNot($coordinator->id)
            ->inRandomOrder()
            ->first();
        $separateNominator = User::whereIsVerifiedGovEmployee()
            ->whereKeyNot($coordinator->id)
            ->whereKeyNot($sharedNominee->id)
            ->inRandomOrder()
            ->first();

        // Nominator same as the submitter
        TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'talent_nomination_event_id' => $event->id,
                'nominee_id' => $sharedNominee->id,
                'submitter_id' => $coordinator->id,
                'nominator_id' => $coordinator->id,
                'nominate_for_advancement' => true,
                'nominate_for_lateral_movement' => true,
                'nominate_for_development_programs' => true,
            ]);

        // Nominator is separate from submitter
        TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'talent_nomination_event_id' => $event->id,
                'nominee_id' => $sharedNominee->id,
                'submitter_id' => $coordinator->id,
                'nominator_id' => $separateNominator->id,
                'nominate_for_advancement' => true,
                'nominate_for_lateral_movement' => false,
                'nominate_for_development_programs' => true,
            ]);

        // Fallback nominator
        TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'talent_nomination_event_id' => $event->id,
                'nominee_id' => $sharedNominee->id,
                'submitter_id' => $coordinator->id,
                'nominator_id' => null,
                'nominate_for_advancement' => false,
                'nominate_for_lateral_movement' => true,
                'nominate_for_development_programs' => true,
            ]);

        // Seed a nomination with unverified users for the nominee, nominator, and advancement reference
        $unverifiedNominee = User::factory()
            ->asApplicant()
            ->withGovEmployeeProfile()
            ->create(['work_email_verified_at' => null]);
        $unverifiedNominator = User::factory()
            ->asApplicant()
            ->withGovEmployeeProfile()
            ->create(['work_email_verified_at' => null]);
        $unverifiedReference = User::factory()
            ->asApplicant()
            ->withGovEmployeeProfile()
            ->create(['work_email_verified_at' => null]);

        TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'talent_nomination_event_id' => $event->id,
                'nominee_id' => $unverifiedNominee->id,
                'submitter_id' => $coordinator->id,
                'nominator_id' => $unverifiedNominator->id,
                'nominate_for_advancement' => true,
                'nominate_for_lateral_movement' => false,
                'nominate_for_development_programs' => false,
                'advancement_reference_id' => $unverifiedReference->id,
            ]);

        // A nomination with an advancement reference that is a verified user
        $advancementReference = User::whereIsVerifiedGovEmployee()
            ->whereKeyNot($coordinator->id)
            ->inRandomOrder()
            ->first();
        TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'talent_nomination_event_id' => $event->id,
                'submitter_id' => $coordinator->id,
                'nominate_for_advancement' => true,
                'nominate_for_lateral_movement' => false,
                'nominate_for_development_programs' => false,
                'advancement_reference_id' => $advancementReference->id,
            ]);

        // Draft nominations in various states
        TalentNomination::factory()
            ->count(1)
            ->noSubmittedSteps()
            ->create([
                'talent_nomination_event_id' => $event->id,
                'submitter_id' => $coordinator->id,
            ]);

        TalentNomination::factory()
            ->count(1)
            ->submittedInstructions()
            ->create([
                'talent_nomination_event_id' => $event->id,
                'submitter_id' => $coordinator->id,
            ]);

        TalentNomination::factory()
            ->count(1)
            ->submittedNomineeInformation()
            ->create([
                'talent_nomination_event_id' => $event->id,
                'submitter_id' => $coordinator->id,
            ]);

        TalentNomination::factory()
            ->count(1)
            ->submittedNominationDetails()
            ->create([
                'talent_nomination_event_id' => $event->id,
                'submitter_id' => $coordinator->id,
            ]);
    }
}
