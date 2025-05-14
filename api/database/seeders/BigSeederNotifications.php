<?php

namespace Database\Seeders;

use App\Models\User;
use App\Notifications\System as SystemNotification;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Seeder;

class BigSeederNotifications extends Seeder
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
        $input = $this->command->ask('Please enter how many notifications to send every user');
        $limit = intval($input);
        $limit = (is_int($limit) && $limit > 0) ? $limit : 1;

        // constant values for reuse and setup
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
        User::chunk(200, function (Collection $users) use ($notification, $limit) {
            foreach ($users as $user) {
                for ($i = 0; $i < $limit; $i++) {
                    $user->notify($notification);
                }
            }
        });
    }
}
