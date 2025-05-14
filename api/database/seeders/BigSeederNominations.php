<?php

namespace Database\Seeders;

use App\Models\TalentNomination;
use App\Models\TalentNominationEvent;
use App\Models\User;
use Illuminate\Database\Seeder;

class BigSeederNominations extends Seeder
{
    /**
     * Run the database seeds.
     *
     * This seeds a lot of data
     * Run this AFTER core data has been seeded, this will not seed platform data
     *
     * Assorted tables
     *
     * @return void
     */
    public function run()
    {
        $input = $this->command->ask('Please enter how many nominations to create');
        $limit = intval($input);
        $limit = (is_int($limit) && $limit > 0) ? $limit : 1;

        // constant values for reuse and setup
        $nominationEventIds = TalentNominationEvent::query()
            ->where('open_date', '<', now())
            ->get()
            ->pluck('id')
            ->toArray();

        // TalentNomination
        for ($i = 0; $i < $limit; $i++) {

            $nominator = User::query()->whereIsGovEmployee(true)->inRandomOrder()->first()->id;
            $nominee = User::query()->whereIsGovEmployee(true)->inRandomOrder()->first()->id;

            TalentNomination::factory()
                ->submittedReviewAndSubmit()
                ->create([
                    'nominator_id' => $nominator,
                    'nominee_id' => $nominee,
                    'talent_nomination_event_id' => array_rand(array_flip($nominationEventIds)),
                ]);
        }
    }
}
