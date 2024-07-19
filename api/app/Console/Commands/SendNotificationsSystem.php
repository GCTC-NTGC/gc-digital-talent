<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\System as SystemNotification;
use Error;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\View;
use Throwable;

class SendNotificationsSystem extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send-notifications:system
                            {viewGroup : The group of views to render the notification with}
                            {emailAddress? : The email address of the user to send to}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send system notifications from blade templates';

    /**
     * The notification vars
     *
     * @var mixed
     */
    private $emailSubject = ['en' => '', 'fr' => ''];

    private $emailContent = ['en' => '', 'fr' => ''];

    private $inAppMessage = ['en' => '', 'fr' => ''];

    private $inAppHref = ['en' => '', 'fr' => ''];

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $successCount = 0;
        $failureCount = 0;

        $viewGroup = $this->argument('viewGroup');

        // find the views in api/resources/views/
        $this->emailSubject = [
            'en' => $viewGroup.'.email_subject_en',
            'fr' => $viewGroup.'.email_subject_fr',
        ];
        $this->emailContent = [
            'en' => $viewGroup.'.email_content_en',
            'fr' => $viewGroup.'.email_subject_fr',
        ];
        $this->inAppMessage = [
            'en' => $viewGroup.'.in_app_message_en',
            'fr' => $viewGroup.'.in_app_message_fr',
        ];
        $this->inAppHref = [
            'en' => $viewGroup.'.in_app_href_en',
            'fr' => $viewGroup.'.in_app_href_fr',
        ];

        collect([
            $this->emailSubject['en'],
            $this->emailSubject['fr'],
            $this->emailContent['en'],
            $this->emailContent['fr'],
            $this->inAppMessage['en'],
            $this->inAppMessage['fr'],
            $this->inAppHref['en'],
            $this->inAppHref['fr'],
        ])->each(function ($viewName) {
            if (! View::exists($viewName)) {
                throw new Error('View not found: '.$viewName);
            }
        });

        $singleEmailAddress = $this->argument('emailAddress');
        if (! is_null($singleEmailAddress)) {
            // single email address provided
            $user = User::where('email', $singleEmailAddress)->sole();
            $this->sendNotification($user, $successCount, $failureCount);
        } else {
            // no email address provided - will send to everyone
            $confirmedEveryone = $this->confirm('This will send the notification to every user.  Do you wish to continue?');
            if (! $confirmedEveryone) {
                $this->warn('Abort');

                return Command::SUCCESS;
            }

            User::chunk(200, function (Collection $users) use (&$successCount, &$failureCount) {
                foreach ($users as $user) {
                    $this->sendNotification($user, $successCount, $failureCount);
                }
            });
        }

        $this->info("Success: $successCount Failure: $failureCount");
        if ($failureCount > 0) {
            return Command::FAILURE;
        } else {
            return Command::SUCCESS;
        }
    }

    private function sendNotification(User $user, &$successCount, &$failureCount)
    {
        try {
            $notification = new SystemNotification(
                $this->emailSubject['en'],
                $this->emailSubject['fr'],
                $this->emailContent['en'],
                $this->emailContent['fr'],
                $this->inAppMessage['en'],
                $this->inAppMessage['fr'],
                $this->inAppHref['en'],
                $this->inAppHref['fr'],
            );
            $user->notify($notification);
            $successCount++;
        } catch (Throwable $e) {
            $this->error($e->getMessage());
            $failureCount++;
        }
    }
}
