<?php

namespace App\Console\Commands;

use App\Models\Pool;
use App\Notifications\ApplicationDeadlineApproaching;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Throwable;

class SendNotificationsApplicationDeadlineApproaching extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send-notifications:application-deadline-approaching';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send notifications to users with a draft application in a pool that is closing in three days from the current day.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        Log::info('SendNotificationsApplicationDeadlineApproaching running at '.Carbon::now()->toDateTimeString());

        $successCount = 0;
        $failureCount = 0;

        // server and database are running in UTC
        $closingDayInPacific = Carbon::now('America/Vancouver')->addDays(3);
        Log::info('Running for closing date '.$closingDayInPacific->toDateString().' (Pacific)');
        $startOfClosingDayInUtc = $closingDayInPacific->copy()->startOfDay()->setTimezone('Etc/UTC')->toDateTimeString();
        $endOfClosingDayInUtc = $closingDayInPacific->copy()->endOfDay()->setTimezone('Etc/UTC')->toDateTimeString();
        Log::info("Finding pools closing between $startOfClosingDayInUtc and $endOfClosingDayInUtc (UTC)");

        $poolsClosingOnClosingDay = Pool::query()
            ->wherePublished()
            ->where('closing_date', '>=', $startOfClosingDayInUtc)
            ->where('closing_date', '<=', $endOfClosingDayInUtc)
            ->with('classification')
            ->get();

        Log::info('Found '.$poolsClosingOnClosingDay->count().' pools.');

        /** @var \App\Models\Pool $pool */
        foreach ($poolsClosingOnClosingDay as $pool) {
            Log::info('Searching pool '.$pool->id.' ('.$pool->name['en'].')');

            $draftApplications = $pool->poolCandidates()
                ->whereNull('submitted_at')
                ->with('user')
                ->get();

            Log::info('Found '.$draftApplications->count().' applications.');

            /** @var \App\Models\PoolCandidate $poolCandidate */
            foreach ($draftApplications as $poolCandidate) {
                $notification = new ApplicationDeadlineApproaching(
                    $closingDayInPacific,
                    $pool->classification->displayName.': '.$pool->name['en'],
                    $pool->classification->displayName.' : '.$pool->name['fr'],
                    $pool->id,
                    $poolCandidate->id,
                );
                try {
                    $poolCandidate->user->notify($notification);
                    $successCount++;
                } catch (Throwable $e) {
                    Log::error('Failure for ['.$poolCandidate->id.']. '.$e->getMessage().' ');
                    $failureCount++;
                }
            }
        }

        Log::info("Success: $successCount Failure: $failureCount");
        if ($failureCount > 0) {
            return Command::FAILURE;
        } else {
            return Command::SUCCESS;
        }
    }
}
