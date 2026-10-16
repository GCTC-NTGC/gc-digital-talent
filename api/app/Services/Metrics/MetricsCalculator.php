<?php

namespace App\Services\Metrics;

use Carbon\CarbonInterface;

/**
 * One group of platform metrics contributed to a snapshot.
 *
 * A snapshot is the union of every registered calculator's output, keyed by
 * key(). Adding a group means writing an implementation and listing it in
 * PlatformMetricsCollector — nothing else changes.
 *
 * Implementations are expected to be expensive and are only ever run by
 * app:compute-platform-metrics, never on the request path.
 */
interface MetricsCalculator
{
    /**
     * The key this group appears under in the snapshot payload, and therefore
     * the field name on the PlatformMetrics GraphQL type. camelCase.
     */
    public function key(): string;

    /**
     * Start of this group's reporting window.
     *
     * Per group rather than per snapshot: windows are a property of what is
     * being measured, not of when the snapshot ran. Talent request metrics
     * start when tracked users shipped; a later group will have its own date,
     * and forcing them to share one would either discard data or include data
     * that does not exist yet.
     */
    public function windowStart(): CarbonInterface;

    /**
     * Compute the group.
     *
     * @param  CarbonInterface  $computedAt  Treated as "now" throughout, so that
     *                                       anything measuring elapsed time is
     *                                       consistent across the whole snapshot.
     * @return array<string, mixed> Keys are camelCase to match GraphQL fields.
     */
    public function calculate(CarbonInterface $computedAt): array;
}
