<?php

namespace App\Generators;

use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Csv;

abstract class CsvGenerator extends FileGenerator
{
    protected Spreadsheet $spreadsheet;

    public function __construct()
    {
        $this->spreadsheet = new Spreadsheet();
    }

    public function write(string $fileName, ?string $dir)
    {

        try {

            $path = $this->getPath($fileName, $dir);
            $writer = new Csv($this->spreadsheet);
            $writer->setDelimiter(',');
            $writer->setEnclosure('"');
            $writer->setLineEnding("\r\n");
            $writer->setSheetIndex(0);
            $writer->save($path);

        } catch (\Exception $e) {
            // Log message and bubble it up
            Log::error('Error saving csv: '.$fileName.' '.$e->getMessage());
            throw $e;
        }
    }

    public function sanitizeString(string $string): string
    {
        return str_replace(["\r", "\n"], ' ', $string);
    }
}
