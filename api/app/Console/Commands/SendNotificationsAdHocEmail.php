<?php

namespace App\Console\Commands;

use App\Enums\NotificationFamily;
use App\Models\User;
use App\Notifications\AdHocEmail;
use Illuminate\Console\Command;
use Illuminate\Contracts\Console\PromptsForMissingInput;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class SendNotificationsAdHocEmail extends Command implements PromptsForMissingInput
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send-notifications:ad-hoc-email
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
    protected $description = 'Send ad hoc email notifications from given GC Notify templates';

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
            $notification = new AdHocEmail($this->argument('templateIdEn'), $this->argument('templateIdFr'));

            $users->chunk(200, function (Collection $chunkOfUsers) use (&$successCount, &$failureCount, $progressBar, $notification) {
                /** @var \App\Models\User $user */
                foreach ($chunkOfUsers as $user) {
                    try {
                        $user->notify($notification);
                        $successCount++;
                    } catch (\Throwable $e) {
                        $this->error("Failed to queue notification for user $user->id: ".$e->getMessage());
                        $failureCount++;
                    } finally {
                        $progressBar->advance();
                    }
                }
            });
            $this->newLine();

            $this->info("Notifications queued.  Success: $successCount Failure: $failureCount");
            if ($failureCount > 0) {
                return Command::FAILURE;
            } else {
                return Command::SUCCESS;
            }
        } else {
            $this->info('Notification sending cancelled');

            return Command::SUCCESS;
        }
    }

    private function getUsersToSendNotificationTo(): Builder
    {
        $emailAddresses = $this->option('emailAddress');
        $notificationFamilies = $this->option('notificationFamily');
        $notifyAllUsers = $this->option('notifyAllUsers');

        $options = $this->options();

        // How many types of options were used?
        $optionTypesCount =
            (count($emailAddresses) > 0 ? 1 : 0) +
            (count($notificationFamilies) > 0 ? 1 : 0) +
            ($notifyAllUsers ? 1 : 0);

        if ($optionTypesCount != 1) {
            throw new \InvalidArgumentException('Must filter users using exactly one of the option types');
        }

        if (count($emailAddresses) > 0) {
            return $this->builderFromEmailAddresses($emailAddresses);
        }

        if (count($notificationFamilies) > 0) {
            return $this->builderFromNotificationFamilies($notificationFamilies);
        }

        if ($notifyAllUsers) {
            return User::query();
        }

        throw new \InvalidArgumentException('Unexpected function end point for options: '.json_encode($options));
    }

    private function builderFromEmailAddresses(array $requestedEmailAddresses): Builder
    {
        $builder = User::whereIn('email', $requestedEmailAddresses);

        // Check for missing email addresses
        $dbEmailAddresses = $builder->pluck('email')->toArray();
        $missingEmailAddresses = array_diff($requestedEmailAddresses, $dbEmailAddresses);
        if (count($missingEmailAddresses) > 0) {
            $this->alert('The following email addresses were not found:');
            foreach ($missingEmailAddresses as $missingEmailAddress) {
                $this->warn($missingEmailAddress);
            }
        }

        return $builder;
    }

    private function builderFromNotificationFamilies(array $notificationFamilies): Builder
    {
        // Check for bad notification families
        $allNotificationFamilies = array_column(NotificationFamily::cases(), 'name');
        foreach ($notificationFamilies as $notificationFamily) {
            if (! in_array($notificationFamily, $allNotificationFamilies)) {
                throw new \InvalidArgumentException('Invalid notification family: '.$notificationFamily);
            }
        }

        $builder = User::whereJsonContains('enabled_email_notifications', $notificationFamilies[0]);
        for ($i = 1; $i < count($notificationFamilies); $i++) {
            $builder->orWhereJsonContains('enabled_email_notifications', $notificationFamilies[$i]);
        }

        return $builder;
    }
}
