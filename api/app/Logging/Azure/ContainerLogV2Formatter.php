<?php

declare(strict_types=1);

namespace App\Logging\Azure;

use Monolog\Formatter\NormalizerFormatter;
use Monolog\Level;
use Monolog\LogRecord;

/**
 * Formats a record as a single line of JSON so that Azure Monitor's
 * ContainerLogV2 collection can classify it correctly.
 *
 * ContainerLogV2 only infers a LogLevel for a line if the line is valid JSON
 * with a key literally named "level" (any other casing, like "LogLevel", is
 * ignored and falls back to unreliable regex-based inference). The
 * timestamp, computer, and container are added by Azure on collection, so
 * they're intentionally left out here.
 *
 * @see https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/containerlogv2
 * @see https://learn.microsoft.com/en-us/azure/azure-monitor/containers/container-insights-logs-schema
 */
class ContainerLogV2Formatter extends NormalizerFormatter
{
    // ContainerLogV2's recognized LogLevel values, keyed by Monolog's level value
    private const LEVEL_MAP = [
        Level::Debug->value => 'DEBUG',
        Level::Info->value => 'INFO',
        Level::Notice->value => 'INFO',
        Level::Warning->value => 'WARNING',
        Level::Error->value => 'ERROR',
        Level::Critical->value => 'CRITICAL',
        Level::Alert->value => 'CRITICAL',
        Level::Emergency->value => 'CRITICAL',
    ];

    /**
     * {@inheritDoc}
     */
    public function format(LogRecord $record): string
    {
        $data = [
            'level' => self::LEVEL_MAP[$record->level->value] ?? 'UNKNOWN',
            'message' => $record->message,
        ];

        $context = $this->normalize($record->context);
        if (! empty($context)) {
            $data['context'] = $context;
        }

        $extra = $this->normalize($record->extra);
        if (! empty($extra)) {
            $data['extra'] = $extra;
        }

        return $this->toJson($data, true).PHP_EOL;
    }

    /**
     * {@inheritDoc}
     */
    public function formatBatch(array $records): string
    {
        return implode('', array_map(fn (LogRecord $record) => $this->format($record), $records));
    }
}
