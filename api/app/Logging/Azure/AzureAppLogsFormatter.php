<?php

declare(strict_types=1);

namespace App\Logging\Azure;

use Illuminate\Support\Arr;
use Monolog\Formatter\FormatterInterface;
use Monolog\LogRecord;

/**
 * Turns a monolog record into a plain array ready for serialization
 */
class AzureAppLogsFormatter implements FormatterInterface
{
    protected static function copyValueIfExists($sourceArray, $key, &$targetArray)
    {
        $value = $sourceArray[$key] ?? null;
        if (! empty($value)) {
            $targetArray[$key] = $value;
        }
    }

    protected static function moveValueIfExists(&$sourceArray, $key, &$targetArray)
    {
        $value = $sourceArray[$key] ?? null;
        if (! empty($value)) {
            $targetArray[$key] = $value;
            unset($sourceArray[$key]);
        }
    }

    protected static function getAzureRecord(LogRecord $record): array
    {
        $dataArray = [];

        // some context fields may be pulled out and promoted if recognized
        $context = $record->context;

        $dataArray['TimeGenerated'] = $record->datetime->format('c');
        $dataArray['LogLevel'] = $record->level->getName();

        self::moveValueIfExists($context, 'EventID', $dataArray);

        // extra fields from TbsLoggingStandardProcessor
        self::copyValueIfExists($record->extra, 'ApplicationID', $dataArray);
        self::copyValueIfExists($record->extra, 'SourceIP', $dataArray);
        self::copyValueIfExists($record->extra, 'XForwardedIP', $dataArray);
        self::copyValueIfExists($record->extra, 'CorrelationID', $dataArray);
        self::copyValueIfExists($record->extra, 'SourceUserID', $dataArray);

        self::moveValueIfExists($context, 'TargetUserID', $dataArray);
        self::moveValueIfExists($context, 'EventStatus', $dataArray);
        self::moveValueIfExists($context, 'EventAction', $dataArray);

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
