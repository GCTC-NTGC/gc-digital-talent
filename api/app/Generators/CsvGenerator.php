<?php

namespace App\Generators;

use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

abstract class CsvGenerator extends FileGenerator implements FileGeneratorInterface
{
    protected ?Spreadsheet $spreadsheet = null;

    protected string $extension = 'xlsx';

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
            $writer = new Xlsx($this->spreadsheet);
            $writer->save($path);

        } catch (\Throwable $e) {
            // Log message and bubble it up
            Log::error('Error saving xlsx: '.$this->fileName.' '.$e->getMessage());
            throw $e;
        }
    }
}
