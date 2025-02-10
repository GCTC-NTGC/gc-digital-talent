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
    protected $description = 'Command description';

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
        PoolCandidateStatus::PLACED_TENTATIVE->name,
        PoolCandidateStatus::PLACED_CASUAL->name,
    ];

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->dry = $this->option('dry');

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

        $final = PoolCandidate::whereIn('pool_candidate_status', $this->finalStatuses)
            ->where(function ($query) {
                $query->whereNotNull('removed_at')
                    ->orWhereNotNull('placed_at');
            });

        $finalCount = $this->update($final, [
            'removed_at' => null,
            'placed_at' => null,
        ]);

        $removed = PoolCandidate::whereIn('pool_candidate_status', $this->removedStatuses)
            ->where(function ($query) {
                $query->whereNotNull('final_decision_at')
                    ->orWhereNotNull('placed_at');
            });

        $removedCount = $this->update($removed, [
            'final_decision_at' => null,
            'placed_at' => null,
        ]);

        $placed = PoolCandidate::whereIn('pool_candidate_status', $this->placedStatuses)
            ->whereNotNull('removed_at');

        $placedCount = $this->update($placed, ['removed_at' => null]);

        $total = $nullCount + $finalCount + $removedCount + $placedCount;
        $this->table(
            ['Null', 'Final', 'Removed', 'Placed', 'Total'],
            [[$nullCount, $finalCount, $removedCount, $placedCount, $total]]
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
