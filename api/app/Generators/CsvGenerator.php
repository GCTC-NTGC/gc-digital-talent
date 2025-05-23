<?php

namespace App\Generators;

use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Csv;

abstract class CsvGenerator extends FileGenerator implements FileGeneratorInterface
{
    protected ?Spreadsheet $spreadsheet = null;

    protected string $extension = 'csv';

    public function __construct(public string $fileName, protected ?string $dir)
    {
        parent::__construct($fileName, $dir);
    }

    public function __destruct()
    {
        // https://phpspreadsheet.readthedocs.io/en/latest/topics/creating-spreadsheet/#clearing-a-workbook-from-memory
        if ($this->spreadsheet) {
            $this->spreadsheet->disconnectWorksheets();
            unset($this->spreadsheet);
        }

    }

    public function write()
    {
        if (! $this->spreadsheet) {

            return;
        }

        try {
            $path = $this->getPath();
            $writer = new Csv($this->spreadsheet);
            $writer->setUseBOM(true);
            $writer->setDelimiter(',');
            $writer->setEnclosure('"');
            $writer->setLineEnding("\r\n");
            $writer->setSheetIndex(0);
            $writer->save($path);

        } catch (\Throwable $e) {
            // Log message and bubble it up
            Log::error('Error saving csv: '.$this->fileName.' '.$e->getMessage());
            throw $e;
        }
    }
}
