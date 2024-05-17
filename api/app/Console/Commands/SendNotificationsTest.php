<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\GcNotifyEmailChannel;
use App\Notifications\Test;
use Illuminate\Console\Command;
use Throwable;

class SendNotificationsTest extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send-notifications:test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send test notifications';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $successCount = 0;
        $failureCount = 0;

        $user = User::where('email', config('notify.smokeTest.emailAddress'))->first();
        if ($user == null) {
            $user = User::factory()->create(['email' => config('notify.smokeTest.emailAddress')]);
            $user->save();
        }

        $notification = new Test('test', GcNotifyEmailChannel::class);
        for ($i = 0; $i < 4; $i++) {
            try {
                $user->notify($notification);
                $successCount++;
            } catch (Throwable $e) {
                $this->error($e->getMessage());
                $failureCount++;
            }
        }

        $this->info("Success: $successCount Failure: $failureCount");
        if ($failureCount > 0) {
            return Command::FAILURE;
        } else {
            return Command::SUCCESS;
        }
    }
}
