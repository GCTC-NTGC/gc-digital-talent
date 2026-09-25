<?php

namespace Database\Seeders;

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
    }
}
