<?php

namespace App\Generators;

use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\Cell\Cell;
use PhpOffice\PhpSpreadsheet\Cell\IValueBinder;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

abstract class ExcelGenerator extends FileGenerator implements FileGeneratorInterface
{
    protected ?Spreadsheet $spreadsheet = null;

    protected string $extension = 'xlsx';

    private IValueBinder $previousValueBinder;

    public function __construct(public string $fileName, protected ?string $dir)
    {
        parent::__construct($fileName, $dir);

        // The value binder is process-global, so save the current one and
        // restore it on destruct to keep the override scoped to this generator.
        $this->previousValueBinder = Cell::getValueBinder();
        Cell::setValueBinder(new NonFormulaValueBinder);
    }

    public function __destruct()
    {
        Cell::setValueBinder($this->previousValueBinder);

        // https://phpspreadsheet.readthedocs.io/en/latest/topics/creating-spreadsheet/#clearing-a-workbook-from-memory
        if ($this->spreadsheet) {
            $this->spreadsheet->disconnectWorksheets();
        }

    }

    public function getSpreadsheet(): ?Spreadsheet
    {
        return $this->spreadsheet;
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
