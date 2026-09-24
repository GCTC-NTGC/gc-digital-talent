<?php

namespace Database\Seeders;

use App\Models\Community;
use App\Models\TalentNominationEvent;
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
        $digital = Community::where('key', 'digital')->first();

        TalentNominationEvent::factory()
            ->withDevelopmentPrograms()
            ->create([
                'name' => [
                    'en' => 'Test Talent Coordinator Event active EN',
                    'fr' => 'Test Talent Coordinator Event active FR',
                ],
                'community_id' => $digital->id,
                'open_date' => now()->subMonth(),
                'close_date' => now()->addMonths(2),
                'include_leadership_competencies' => true,
                'include_nine_box' => true,
            ]);
    }
}
