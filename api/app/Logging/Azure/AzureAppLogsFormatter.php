<?php

declare(strict_types=1);

namespace App\Logging\Azure;

use Illuminate\Support\Arr;
use Monolog\Formatter\FormatterInterface;
use Monolog\LogRecord;

/**
 * Formats a monolog record into a string
 */
class AzureAppLogsFormatter implements FormatterInterface
{
    // copy an array value to a target array, only if it exists, as a string
    protected static function copyValueAsString($sourceArray, $key, &$targetArray)
    {
        $value = $sourceArray[$key] ?? null;
        if (! empty($value)) {
            $targetArray[$key] = strval($value);
        }
    }

    // copy an array value to a target array, only if it exists, as a string, and remove from source array
    protected static function moveValueAsString(&$sourceArray, $key, &$targetArray)
    {
        $value = $sourceArray[$key] ?? null;
        if (! empty($value)) {
            $targetArray[$key] = strval($value);
            unset($sourceArray[$key]);
        }
    }

    protected static function getAzureRecord(LogRecord $record): array
    {
        $dataArray = [];

        // some context fields may be pulled out and promoted to their own fields if recognized
        $context = $record->context;

        $dataArray['TimeGenerated'] = $record->datetime->format('c');
        $dataArray['LogLevel'] = $record->level->getName();

        self::moveValueAsString($context, 'EventID', $dataArray);

        // extra fields from TbsLoggingStandardProcessor
        self::copyValueAsString($record->extra, 'ApplicationID', $dataArray);
        self::copyValueAsString($record->extra, 'SourceIP', $dataArray);
        self::copyValueAsString($record->extra, 'XForwardedIP', $dataArray);
        self::copyValueAsString($record->extra, 'CorrelationID', $dataArray);
        self::copyValueAsString($record->extra, 'SourceUserID', $dataArray);

        self::moveValueAsString($context, 'TargetUserID', $dataArray);
        self::moveValueAsString($context, 'EventStatus', $dataArray);
        self::moveValueAsString($context, 'EventAction', $dataArray);

        $dataArray['EventText'] = $record->message;
        $dataArray['Context'] = $context;

        return $dataArray;
    }

    /**
     * {@inheritDoc}
     */
    public function format(LogRecord $record): string
    {
        $azureRecords = [self::getAzureRecord($record)];

        return json_encode($azureRecords);
    }

    /**
     * {@inheritDoc}
     */
    public function formatBatch(array $records): string
    {
        $azureRecords = Arr::map($records, fn ($r) => self::getAzureRecord($r));

        return json_encode($azureRecords);
    }
}
