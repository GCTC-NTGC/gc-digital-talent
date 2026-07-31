<?php

declare(strict_types=1);

namespace App\Logging;

use Monolog\Formatter\FormatterInterface;
use Monolog\LogRecord;

/**
 * Formats a record as a plain "LEVEL: message" line, with no timestamp,
 * channel, or context/extra data.
 *
 * Azure App Service log stream classifies stdout/stderr lines by the
 * leading level keyword, so keeping the format this bare avoids Monolog's
 * default context/extra JSON confusing that classification.
 */
class SimplifiedFormatter implements FormatterInterface
{
    /**
     * {@inheritDoc}
     */
    public function format(LogRecord $record): string
    {
        return sprintf('%s: %s%s', $record->level->getName(), $record->message, PHP_EOL);
    }

    /**
     * {@inheritDoc}
     */
    public function formatBatch(array $records): string
    {
        return implode('', array_map(fn (LogRecord $record) => $this->format($record), $records));
    }
}
