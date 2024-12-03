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
                            {emailAddress? : The email address of the user to send to}
                            {--channelEmail : Enable sending via the email channel}
                            {--channelApp : Enable sending via the app channel}
                            ';

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
    private $channelEmail = false;

    private $channelApp = false;

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

        $this->channelEmail = $this->option('channelEmail');

        $this->channelApp = $this->option('channelApp');

        if (! $this->channelEmail && ! $this->channelApp) {
            $this->error('No channels selected.');

            return Command::FAILURE;
        }

        $configuredViews = [];

        // find the views in api/resources/views/
        if ($this->channelEmail) {
            $this->emailSubject = [
                'en' => $viewGroup.'.email_subject_en',
                'fr' => $viewGroup.'.email_subject_fr',
            ];
            $this->emailContent = [
                'en' => $viewGroup.'.email_content_en',
                'fr' => $viewGroup.'.email_subject_fr',
            ];
            $configuredViews[] = $this->emailSubject['en'];
            $configuredViews[] = $this->emailSubject['fr'];
            $configuredViews[] = $this->emailContent['en'];
            $configuredViews[] = $this->emailContent['fr'];
        }

        if ($this->channelApp) {
            $this->inAppMessage = [
                'en' => $viewGroup.'.in_app_message_en',
                'fr' => $viewGroup.'.in_app_message_fr',
            ];
            $this->inAppHref = [
                'en' => $viewGroup.'.in_app_href_en',
                'fr' => $viewGroup.'.in_app_href_fr',
            ];
            $configuredViews[] = $this->inAppMessage['en'];
            $configuredViews[] = $this->inAppMessage['fr'];
            $configuredViews[] = $this->inAppHref['en'];
            $configuredViews[] = $this->inAppHref['fr'];
        }

        foreach ($configuredViews as $configuredView) {
            if (! View::exists($configuredView)) {
                throw new Error('View not found: '.$configuredView);
            }
        }

        $singleEmailAddress = $this->argument('emailAddress');
        if (! is_null($singleEmailAddress)) {
            // single email address provided
            $user = User::where('email', $singleEmailAddress)->sole();
            $this->sendNotification($user, $successCount, $failureCount);
        } else {
            // no email address provided - will send to everyone
            $confirmedEveryone = $this->confirm(
                sprintf(
                    'This will send the notification to every user via %s%s%s. Do you wish to continue?',
                    $this->channelEmail ? 'email' : '',
                    $this->channelEmail && $this->channelApp ? ', ' : '',
                    $this->channelApp ? 'in-app' : ''
                )
            );
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
                $this->channelEmail,
                $this->channelApp,
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
