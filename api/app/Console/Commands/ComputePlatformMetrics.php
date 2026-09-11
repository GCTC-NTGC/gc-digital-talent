<?php

namespace App\Console\Commands;

use App\Models\PlatformMetricSnapshot;
use App\Services\Metrics\PlatformMetricsCollector;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class ComputePlatformMetrics extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:compute-platform-metrics';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Computes platform-wide success metrics and stores them as a snapshot';

    /**
     * Execute the console command.
     *
     * The collector is a parameter rather than constructed here so the
     * container supplies it — Laravel resolves handle()'s type hints the same
     * way it resolves a constructor's.
     *
     * Always inserts a new snapshot rather than updating today's. Rows are the
     * history: keeping them is what lets the metrics be charted over time later,
     * and it means a duplicate run (the scheduler's withoutOverlapping lock is
     * per-instance, so it cannot prevent one across App Service instances)
     * leaves a harmless extra row rather than corrupting anything.
     */
    public function handle(PlatformMetricsCollector $collector): int
    {
        $computedAt = Carbon::now();

        $snapshot = PlatformMetricSnapshot::create([
            'version' => PlatformMetricSnapshot::SHAPE_VERSION,
            'computed_at' => $computedAt,
            'metrics' => $collector->collect($computedAt),
        ]);

        $this->info(sprintf(
            'Wrote platform metrics snapshot %s (shape version %d) covering %s.',
            $snapshot->id,
            $snapshot->version,
            implode(', ', array_keys($snapshot->metrics)),
        ));

        return self::SUCCESS;
    }
}
