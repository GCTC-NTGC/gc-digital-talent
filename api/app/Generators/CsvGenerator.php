<?php

namespace App\Generators;

use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Csv;

abstract class CsvGenerator extends FileGenerator
{
    protected Spreadsheet $spreadsheet;

    public function __construct()
    {
        $this->spreadsheet = new Spreadsheet();
    }

    public function write(string $fileName)
    {
        /** @var \Illuminate\Filesystem\FilesystemManager */
        $disk = Storage::disk('user_generated');

        $path = $disk->path($fileName);

        $writer = new Csv($this->spreadsheet);
        $writer->setDelimiter(',');
        $writer->setEnclosure('"');
        $writer->setLineEnding("\r\n");
        $writer->setSheetIndex(0);

        return $writer->save($path);
    }

    public function sanitizeString(string $string): string
    {
        return str_replace(["\r", "\n"], ' ', $string);
    }
}
