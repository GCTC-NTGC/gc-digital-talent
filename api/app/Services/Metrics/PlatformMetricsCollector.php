<?php

namespace App\Services\Metrics;

use Carbon\CarbonInterface;
use Illuminate\Contracts\Container\Container;

/**
 * Assembles a full platform metrics payload from every registered calculator.
 *
 * Separate from the console command so that anything else needing the same
 * payload — an on-demand refresh, a backfill — uses one registry rather than
 * its own copy of the list.
 */
class PlatformMetricsCollector
{
    /**
     * The metric groups every snapshot contains.
     *
     * To add a group: implement MetricsCalculator and add it here. Bump
     * PlatformMetricSnapshot::SHAPE_VERSION at the same time, since adding a
     * key changes the payload shape.
     *
     * @var array<int, class-string<MetricsCalculator>>
     */
    private const CALCULATORS = [
        TalentRequestMetricsCalculator::class,
    ];

    public function __construct(private Container $container) {}

    /**
     * @return array<string, mixed> Keyed by each calculator's key(), with that
     *                              group's own windowStart alongside its metrics.
     */
    public function collect(CarbonInterface $computedAt): array
    {
        $metrics = [];

        foreach (self::CALCULATORS as $class) {
            /** @var MetricsCalculator $calculator */
            $calculator = $this->container->make($class);

            $metrics[$calculator->key()] = array_merge(
                // Stored with the group, not on the snapshot row, because each
                // group measures its own period.
                ['windowStart' => $calculator->windowStart()->toDateString()],
                $calculator->calculate($computedAt),
            );
        }

        return $metrics;
    }
}
