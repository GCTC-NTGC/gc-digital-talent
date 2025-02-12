<?php

namespace App\Console\Commands;

use App\Enums\PoolCandidateStatus;
use App\Models\PoolCandidate;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Builder;

class UpdateApplicationTimestamps extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-application-timestamps
                            {--dry : Dry run to see how many candidates will be affected}
    ';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Updates application timestamps based on status.';

    private $dry = false;

    private $nullStatuses = [
        PoolCandidateStatus::NEW_APPLICATION->name,
        PoolCandidateStatus::APPLICATION_REVIEW->name,
        PoolCandidateStatus::SCREENED_IN->name,
        PoolCandidateStatus::UNDER_ASSESSMENT->name,
    ];

    private $finalStatuses = [
        PoolCandidateStatus::SCREENED_OUT_APPLICATION->name,
        PoolCandidateStatus::SCREENED_OUT_ASSESSMENT->name,
        PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
        PoolCandidateStatus::QUALIFIED_UNAVAILABLE->name,
        PoolCandidateStatus::QUALIFIED_WITHDREW->name,
        PoolCandidateStatus::PLACED_TENTATIVE->name,
        PoolCandidateStatus::EXPIRED->name,
    ];

    private $removedStatuses = [
        PoolCandidateStatus::SCREENED_OUT_NOT_INTERESTED->name,
        PoolCandidateStatus::SCREENED_OUT_NOT_RESPONSIVE->name,
        PoolCandidateStatus::REMOVED->name,
    ];

    private $placedStatuses = [
        PoolCandidateStatus::PLACED_INDETERMINATE->name,
        PoolCandidateStatus::PLACED_TERM->name,
        PoolCandidateStatus::PLACED_CASUAL->name,
    ];

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->dry = $this->option('dry');

        $now = now();

        // Null out all timestamps
        $nullCandidates = PoolCandidate::whereIn('pool_candidate_status', $this->nullStatuses)
            ->where(function ($query) {
                $query->whereNotNull('removed_at')
                    ->orWhereNotNull('placed_at')
                    ->orWhereNotNull('final_decision_at');
            });

        $nullCount = $this->update($nullCandidates, [
            'removed_at' => null,
            'placed_at' => null,
            'final_decision_at' => null,
        ]);

        // Null non final decision fields
        $final = PoolCandidate::whereIn('pool_candidate_status', $this->finalStatuses)
            ->where(function ($query) {
                $query->whereNotNull('removed_at')
                    ->orWhereNotNull('placed_at');
            });

        $finalCount = $this->update($final, [
            'removed_at' => null,
            'placed_at' => null,
        ]);

        // Set final decision where null
        $finalNull = PoolCandidate::whereIn('pool_candidate_status', $this->finalStatuses)
            ->whereNull('final_decision_at');

        $finalCount += $this->update($finalNull, ['final_decision_at' => $now]);

        // Null non removed at fields
        $removed = PoolCandidate::whereIn('pool_candidate_status', $this->removedStatuses)
            ->whereNotNull('placed_at');

        $removedCount = $this->update($removed, [
            'placed_at' => null,
        ]);

        // Set removed at where null
        $removedNull = PoolCandidate::whereIn('pool_candidate_status', $this->removedStatuses)
            ->whereNull('removed_at');

        $removedCount += $this->update($removedNull, ['removed_at' => $now]);

        $placed = PoolCandidate::whereIn('pool_candidate_status', $this->placedStatuses)
            ->whereNotNull('removed_at');

        $placedCount = $this->update($placed, ['removed_at' => null]);

        $placedNullFinal = PoolCandidate::whereIn('pool_candidate_status', $this->placedStatuses)
            ->whereNull('final_decision_at');

        $placedCount += $this->update($placedNullFinal, ['final_decision_at' => $now]);

        $placedNullPlaced = PoolCandidate::whereIn('pool_candidate_status', $this->placedStatuses)
            ->whereNull('placed_at');

        $placedCount += $this->update($placedNullPlaced, ['placed_at' => $now]);

        $suspended = PoolCandidate::where('pool_candidate_status', PoolCandidateStatus::QUALIFIED_WITHDREW->name)
            ->whereNull('suspended_at');

        $suspendedCount = $this->update($suspended, ['suspended_at' => $now]);

        $total = $nullCount + $finalCount + $removedCount + $placedCount + $suspendedCount;
        $this->table(
            ['Null', 'Final', 'Removed', 'Placed', 'Suspended', 'Total'],
            [[$nullCount, $finalCount, $removedCount, $placedCount, $suspendedCount, $total]]
        );
    }

    private function update(Builder $query, array $state)
    {
        if (! $this->dry) {
            $query->chunk(100, function ($candidates) use ($state) {
                foreach ($candidates as $candidate) {
                    $candidate->update($state);
                }
            });
        }

        return $query->count();

    }
}
