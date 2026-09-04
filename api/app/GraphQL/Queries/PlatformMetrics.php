<?php

namespace App\GraphQL\Queries;

use App\Models\PlatformMetricSnapshot;
use Illuminate\Support\Facades\App;

/**
 * Serves the most recent platform metrics snapshot.
 *
 * This reads a single precomputed row — the expensive work happened overnight in
 * app:compute-platform-metrics. Nothing here should ever fall back to computing
 * metrics on demand: those queries seq-scan activity_log, which is exactly what
 * the snapshot table exists to keep off the request path.
 */
final class PlatformMetrics
{
    /**
     * @param  array<string, mixed>  $args
     * @return array<string, mixed>|null Null when no readable snapshot exists —
     *                                   before the first nightly run, and again
     *                                   after a deploy that bumps the shape
     *                                   version. Callers render an empty state.
     */
    public function __invoke($_, array $args): ?array
    {
        $snapshot = PlatformMetricSnapshot::latestReadable();

        if (is_null($snapshot)) {
            return null;
        }

        return [
            'computedAt' => $snapshot->computed_at,
            ...$this->localizeCommunityNames($snapshot->metrics),
        ];
    }

    /**
     * Add the `localized` key to every community name.
     *
     * Snapshots store names as {en, fr} only — a stored `localized` would be
     * frozen to whatever locale the nightly job happened to run in. The
     * LocalizedString cast does the same thing at read time for Eloquent
     * attributes; this is the equivalent for a payload that never passes
     * through a cast.
     *
     * @param  array<string, mixed>  $metrics
     * @return array<string, mixed>
     */
    private function localizeCommunityNames(array $metrics): array
    {
        return $this->walkCommunities($metrics, App::getLocale() ?? 'en');
    }

    /**
     * @param  array<string, mixed>  $node
     * @return array<string, mixed>
     */
    private function walkCommunities(array $node, string $locale): array
    {
        foreach ($node as $key => $value) {
            if (! is_array($value)) {
                continue;
            }

            if ($key === 'community' && isset($value['name']) && is_array($value['name'])) {
                $value['name']['localized'] = $value['name'][$locale] ?? null;
                $node[$key] = $value;

                continue;
            }

            $node[$key] = $this->walkCommunities($value, $locale);
        }

        return $node;
    }
}
