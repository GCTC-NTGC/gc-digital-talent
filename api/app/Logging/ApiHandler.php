<?php

declare(strict_types=1);

namespace App\Logging;

use Monolog\Formatter\FormatterInterface;
use Monolog\Formatter\JsonFormatter;
use Monolog\Handler\AbstractProcessingHandler;
use Monolog\LogRecord;

/**
 * Base class for all api handlers
 * Adapted from MailHandler
 */
abstract class ApiHandler extends AbstractProcessingHandler
{
    /**
     * {@inheritDoc}
     */
    public function handleBatch(array $records): void
    {
        $messages = [];

        foreach ($records as $record) {
            if ($record->level->isLowerThan($this->level)) {
                continue;
            }

            $message = $this->processRecord($record);
            $messages[] = $message;
        }

        if (\count($messages) > 0) {
            $this->send((string) $this->getFormatter()->formatBatch($messages), $messages);
        }
    }

    /**
     * Send a message with the given content
     *
     * @param  string  $content  formatted body to be sent
     * @param  array  $records  the array of log records that formed this content
     *
     * @phpstan-param non-empty-array<LogRecord> $records
     */
    abstract protected function send(string $content, array $records): void;

    /**
     * {@inheritDoc}
     */
    protected function write(LogRecord $record): void
    {
        $this->send((string) $record->formatted, [$record]);
    }

    /**
     * @phpstan-param non-empty-array<LogRecord> $records
     */
    protected function getHighestRecord(array $records): LogRecord
    {
        $highestRecord = null;
        foreach ($records as $record) {
            if ($highestRecord === null || $record->level->isHigherThan($highestRecord->level)) {
                $highestRecord = $record;
            }
        }

        return $highestRecord;
    }

    /**
     * Gets the default formatter.
     */
    protected function getDefaultFormatter(): FormatterInterface
    {
        return new JsonFormatter();
    }
}
