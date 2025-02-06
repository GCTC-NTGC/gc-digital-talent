<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\System as SystemNotification;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Collection;
use Throwable;

class SendNotificationsVerifyWorkEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send-notifications:verify-work-email';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send in-app notification to government users with unverified work emails';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $successCount = 0;
        $failureCount = 0;

        $viewGroup = 'notification_verify_work_email';

        User::where('computed_is_gov_employee', true)
            ->whereNull('work_email_verified_at')
            ->chunk(200, function (Collection $users) use (&$successCount, &$failureCount, $viewGroup) {
                foreach ($users as $user) {
                    try {
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
                        $user->notify($notification);
                        $successCount++;
                    } catch (Throwable $e) {
                        $this->error($e->getMessage().' User id: '.$user->id);
                        $failureCount++;
                    }
                }
            });

        $this->info("Success: $successCount Failure: $failureCount");
        if ($failureCount > 0) {
            return Command::FAILURE;
        } else {
            return Command::SUCCESS;
        }
    }
}
