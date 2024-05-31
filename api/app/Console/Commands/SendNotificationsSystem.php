<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\System as SystemNotification;
use Error;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\View;
use Throwable;

class SendNotificationsSystem extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send-notifications:system';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send system notifications from blade templates';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $successCount = 0;
        $failureCount = 0;

        $viewGroup = 'notification_announcement';

        // find the views in api/resources/views/
        $emailSubjectEn = $viewGroup.'.email_subject_en';
        $emailSubjectFr = $viewGroup.'.email_subject_fr';
        $emailContentEn = $viewGroup.'.email_content_en';
        $emailContentFr = $viewGroup.'.email_content_fr';
        $inAppMessageEn = $viewGroup.'.in_app_message_en';
        $inAppMessageFr = $viewGroup.'.in_app_message_fr';
        $inAppHrefEn = $viewGroup.'.in_app_href_en';
        $inAppHrefFr = $viewGroup.'.in_app_href_fr';

        collect([
            $emailSubjectEn,
            $emailSubjectFr,
            $emailContentEn,
            $emailContentFr,
            $inAppMessageEn,
            $inAppMessageFr,
            $inAppHrefEn,
            $inAppHrefFr,
        ])->each(function ($viewName) {
            if (! View::exists($viewName)) {
                throw new Error('View not found: '.$viewName);
            }
        });

        $user = User::where('sub', 'applicant@test.com')->sole();

        // foreach (User::all() as $user) {
        try {
            $notification = new SystemNotification(
                $emailSubjectEn = $emailSubjectEn,
                $emailSubjectFr = $emailSubjectFr,
                $emailContentEn = $emailContentEn,
                $emailContentFr = $emailContentFr,
                $inAppMessageEn = $inAppMessageEn,
                $inAppMessageFr = $inAppMessageFr,
                $inAppHrefEn = $inAppHrefEn,
                $inAppHrefFr = $inAppHrefFr,
            );
            $user->notify($notification);
            $successCount++;
        } catch (Throwable $e) {
            $this->error($e->getMessage());
            $failureCount++;
        }
        // }

        $this->info("Success: $successCount Failure: $failureCount");
        if ($failureCount > 0) {
            return Command::FAILURE;
        } else {
            return Command::SUCCESS;
        }
    }
}
