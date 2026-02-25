<?php

declare(strict_types=1);

namespace App\Logging\Azure;

use Monolog\Formatter\FormatterInterface;
use Monolog\LogRecord;

class AzureRecord
{
    public function __construct(
        public ?string $applicationId,
        public ?string $sourceIp,
        public ?string $sourceUserId,

        public ?FormatterInterface $formatter,
    ) {}

    /**
     * Returns required data in format that Azure
     * is expecting.
     *
     * @phpstan-return mixed[]
     */
    public function getAzureData(LogRecord $record): array
    {
        $dataArray = [];

        $dataArray['TimeGenerated'] = $record->datetime->format('c');
        $dataArray['LogLevel'] = $record->level->getName();
        if ($this->applicationId !== null) {
            $dataArray['ApplicationID'] = $this->applicationId;
        }
        if ($this->sourceIp !== null) {
            $dataArray['SourceIP'] = $this->sourceIp;
        }
        if ($this->sourceUserId !== null) {
            $dataArray['SourceUserID'] = $this->sourceUserId;
        }

        $dataArray['EventText'] = $record->message;
        $dataArray['Context'] = $record->context;

        return $dataArray;
    }

    /**
     * @return $this
     */
    public function setFormatter(?FormatterInterface $formatter = null): self
    {
        $this->formatter = $formatter;

        return $this;
    }
}
