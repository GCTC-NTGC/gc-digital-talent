<?php

namespace App\Generators;

abstract class CsvGenerator extends FileGenerator implements FileGeneratorInterface
{
    protected ?\SplFileObject $file = null;

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
        $this->file = new \SplFileObject($this->getPath(), 'w');
        $this->file->fwrite("\xEF\xBB\xBF");
    }

    protected function writeRow(array $row): void
    {
        if ($this->file) {
            $this->file->fputcsv($row);
        }
    }

    protected function closeCsv(): void
    {
        if ($this->file) {
            $this->file = null;
        }
    }
}
