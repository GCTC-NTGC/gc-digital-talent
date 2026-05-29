<?php

namespace App\Generators;

abstract class CsvGenerator extends FileGenerator implements FileGeneratorInterface
{
    /** @var resource|null */
    protected $handle = null;

    protected string $extension = 'csv';

    public function __construct(public string $fileName, protected ?string $dir)
    {
        parent::__construct($fileName, $dir);
    }

    public function write(): void
    {
        // File is written to disk during generate() — nothing to do here.
    }

    protected function openCsv(): void
    {
        $path = $this->getPath();
        $this->handle = fopen($path, 'w');
        // UTF-8 BOM for Excel compatibility
        fwrite($this->handle, "\xEF\xBB\xBF");
    }

    protected function writeRow(array $row): void
    {
        if ($this->handle) {
            fputcsv($this->handle, $row);
        }
    }

    protected function closeCsv(): void
    {
        if ($this->handle) {
            fclose($this->handle);
            $this->handle = null;
        }
    }
}
