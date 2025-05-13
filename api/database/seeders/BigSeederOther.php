<?php

namespace Database\Seeders;

use App\Models\TalentNomination;
use App\Models\TalentNominationEvent;
use App\Models\User;
use App\Notifications\System as SystemNotification;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Seeder;

class BigSeederOther extends Seeder
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
        // constant values for reuse and setup
        $nominationEventIds = TalentNominationEvent::query()
            ->where('open_date', '<', now())
            ->get()
            ->pluck('id')
            ->toArray();

        $viewGroup = 'notification_test';
        $notification = new SystemNotification(
            channelEmail: false,
            channelApp: true,
            emailSubjectEn: '',
            emailSubjectFr: '',
            emailContentEn: '',
            emailContentFr: '',
            inAppMessageEn: $viewGroup.'.in_app_message_en',
            inAppMessageFr: $viewGroup.'.in_app_message_fr',
            inAppHrefEn: $viewGroup.'.in_app_href_en',
            inAppHrefFr: $viewGroup.'.in_app_href_fr',
        );

        // Notification, send five to every user
        User::chunk(200, function (Collection $users) use ($notification) {
            foreach ($users as $user) {
                for ($i = 0; $i < 5; $i++) {
                    $user->notify($notification);
                }
            }
        });

        // TalentNomination
        for ($i = 0; $i < 1000; $i++) {

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
