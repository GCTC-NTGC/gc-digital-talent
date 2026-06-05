<?php

namespace App\Generators;

use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

abstract class ExcelGenerator extends FileGenerator implements FileGeneratorInterface
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
        }

    }

    public function getSpreadsheet(): ?Spreadsheet
    {
        return $this->spreadsheet;
    }

    // Build a spreadsheet whose value binder keeps "="-leading user text as a
    // string. The binder lives on the instance so it survives queue
    // serialization — generate() runs in the worker, not where we were built.
    protected function newSpreadsheet(): Spreadsheet
    {
        $spreadsheet = new Spreadsheet();
        $spreadsheet->setValueBinder(new NonFormulaValueBinder());

        return $spreadsheet;
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
