<?php

declare(strict_types=1);

namespace App\Logging\Azure;

use Monolog\Formatter\FormatterInterface;
use Monolog\LogRecord;

class AzureRecord
{
    /**
     * Column 01
     */
    private ?string $column01;

    /**
     * Column 02
     */
    private ?string $column02;

    private ?FormatterInterface $formatter;

    public function __construct(
        ?string $column01 = null,
        ?string $column02 = null,
        ?FormatterInterface $formatter = null
    ) {
        $this
            ->setColumn01($column01)
            ->setColumn02($column02)
            ->setFormatter($formatter);
    }

    /**
     * Returns required data in format that Azure
     * is expecting.
     *
     * @phpstan-return mixed[]
     */
    public function getAzureData(LogRecord $record): array
    {
        $dataArray = [];

        if ($this->column01 !== null) {
            $dataArray['Column01'] = $this->column01;
        }

        if ($this->column02 !== null) {
            $dataArray['Column02'] = $this->column02;
        }

        $finalArray = array_merge($dataArray, $record->toArray());

        return $finalArray;
    }

    /**
     * first placeholder column
     *
     * @return $this
     */
    public function setColumn01(?string $column01 = null): self
    {
        $this->column01 = $column01;

        return $this;
    }

    /**
     * second placeholder column
     *
     * @return $this
     */
    public function setColumn02(?string $column02 = null): self
    {
        $this->column02 = $column02;

        return $this;
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
