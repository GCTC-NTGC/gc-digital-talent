<?php

namespace App\Generators;

use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Csv;

abstract class CsvGenerator extends FileGenerator implements FileGeneratorInterface
{
    protected ?Spreadsheet $spreadsheet;

    public function __construct(public string $fileName, protected ?string $dir) {}

    public function write()
    {
        if (! $this->spreadsheet) {
            Log::error('CSV must be generated before saving.');

            return;
        }

        try {
            $path = $this->getPath($this->fileName, $this->dir);
            $writer = new Csv($this->spreadsheet);
            $writer->setDelimiter(',');
            $writer->setEnclosure('"');
            $writer->setLineEnding("\r\n");
            $writer->setSheetIndex(0);
            $writer->save($path);

        } catch (\Exception $e) {
            // Log message and bubble it up
            Log::error('Error saving csv: '.$this->fileName.' '.$e->getMessage());
            throw $e;
        }
    }
}
