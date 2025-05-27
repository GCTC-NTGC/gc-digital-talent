<?php

namespace Database\Seeders;

use App\Models\Community;
use App\Models\TalentNomination;
use App\Models\TalentNominationEvent;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Seeder;

class BigSeederNominations extends Seeder
{
    /**
     * Run the database seeds.
     *
     * This seeds a lot of data
     * Run this AFTER core data has been seeded, this will not seed platform data
     *
     * TalentNomination
     *
     * @return void
     */
    public function run()
    {
        $input = $this->command->ask('Please enter how many nominations to create');
        $limit = intval($input);
        $limit = (is_int($limit) && $limit > 0) ? $limit : 1;

        // constant values for reuse and setup
        $digitalCommunityId = Community::select('id')->where('key', 'digital')->sole()->id;
        $atipCommunityId = Community::select('id')->where('key', 'atip')->sole()->id;
        $financeCommunityId = Community::select('id')->where('key', 'finance')->sole()->id;
        $nominationEventCommunityIds = [$digitalCommunityId, $atipCommunityId, $financeCommunityId];
        $nominationEventIds = TalentNominationEvent::query()
            ->where('open_date', '<', now())
            ->whereIn('community_id', $nominationEventCommunityIds)
            ->get()
            ->pluck('id')
            ->toArray();

        // TalentNomination
        for ($i = 0; $i < $limit; $i++) {

            $nominator = User::query()->whereIsGovEmployee(true)->inRandomOrder()->first()->id;
            $nominee = User::query()
                ->whereIsGovEmployee(true)
                ->whereHas('employeeProfile', function (Builder $query) use ($nominationEventCommunityIds) {
                    return $query->whereHas('communityInterests', function (Builder $query) use ($nominationEventCommunityIds) {
                        return $query->whereIn('community_id', $nominationEventCommunityIds);
                    });
                })
                ->inRandomOrder()
                ->first()
                ->id;

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
