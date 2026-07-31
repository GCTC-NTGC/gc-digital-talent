<?php

declare(strict_types=1);

namespace App\Logging\Azure;

use Monolog\Formatter\NormalizerFormatter;
use Monolog\Level;
use Monolog\LogRecord;

/**
 * Formats a record as a single line of JSON using the column names from the
 * ContainerLogV2 schema, so Azure's log collection can pick them up directly
 * instead of guessing the level from unstructured text.
 *
 * @see https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/containerlogv2
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
            'LogLevel' => self::LEVEL_MAP[$record->level->value] ?? 'UNKNOWN',
            'LogMessage' => $record->message,
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
