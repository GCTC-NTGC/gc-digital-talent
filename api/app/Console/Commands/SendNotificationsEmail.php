<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Contracts\Console\PromptsForMissingInput;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class SendNotificationsEmail extends Command implements PromptsForMissingInput
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send-notifications:email
                                {templateIdEn : The template ID for the English email message}
                                {templateIdFr : The template ID for the French email message}
                                {--emailAddress=* : The list of contact email addresses to send the notification to}
                                {--notificationFamily=* : The list of notification families to send the notification to}
                                {--notifyAllUsers : Send the notification to all users}
    ';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send email notifications from given GC Notify templates';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $successCount = 0;
        $failureCount = 0;

        $users = $this->getUsersToSendNotificationTo();
        $userCount = $users->count();

        if ($this->confirm('Do you wish to send notifications to '.$userCount.' users?')) {

            $progressBar = $this->output->createProgressBar($userCount);

            $users->chunk(200, function (Collection $users) use (&$successCount, &$failureCount, $progressBar) {
                foreach ($users as $user) {
                    try {
                        // $this->sendNotification($user, $successCount, $failureCount);
                        $successCount++;
                    } catch (\Throwable $e) {
                        $this->error("Failed to send notification to user $user->id: ".$e->getMessage());
                        $failureCount++;
                    } finally {
                        $progressBar->advance();
                    }
                }
            });
            $this->newLine();

        }

        $this->info("Success: $successCount Failure: $failureCount");
        if ($failureCount > 0) {
            return Command::FAILURE;
        } else {
            return Command::SUCCESS;
        }
    }

    private function getUsersToSendNotificationTo(): Builder
    {
        $emailAddresses = $this->option('emailAddress');
        $notificationFamilies = $this->option('notificationFamily');
        $notifyAllUsers = $this->option('notifyAllUsers');

        $options = $this->options();

        $optionSelectedCount =
            (count($emailAddresses) > 0 ? 1 : 0) +
            (count($notificationFamilies) > 0 ? 1 : 0) +
            ($notifyAllUsers ? 1 : 0);

        if ($optionSelectedCount != 1) {
            throw new \Error('Filter users using exactly one of the option types');
        }

        if (count($emailAddresses) > 0) {
            return User::whereIn('email', $emailAddresses);
        }

        if (count($notificationFamilies) > 0) {
            $builder = User::whereJsonContains('enabled_email_notifications', $notificationFamilies[0]);
            for ($i = 1; $i < count($notificationFamilies); $i++) {
                $builder->orWhereJsonContains('enabled_email_notifications', $notificationFamilies[$i]);
            }

            return $builder;
        }

        if ($notifyAllUsers) {
            return User::query();
        }

        throw new \Error('Unexpected function end point for options: '.json_encode($options));
    }
}
