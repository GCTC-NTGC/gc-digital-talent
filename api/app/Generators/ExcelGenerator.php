<?php

namespace App\Generators;

use OpenSpout\Common\Entity\Cell;
use OpenSpout\Common\Entity\Cell\FormulaCell;
use OpenSpout\Common\Entity\Cell\StringCell;
use OpenSpout\Common\Entity\Row;
use OpenSpout\Writer\XLSX\Writer;

abstract class ExcelGenerator extends FileGenerator implements FileGeneratorInterface
{
    protected ?Writer $writer = null;

    protected string $extension = 'xlsx';

    public function __construct(public string $fileName, protected ?string $dir)
    {
        parent::__construct($fileName, $dir);
    }

    public function write(): void
    {
        // File is written to disk during generate() — nothing to do here.
    }

    // Build a row, demoting "="-leading strings from formulas back to text.
    protected function row(array $values): Row
    {
        $cells = array_map(function ($value) {
            $cell = Cell::fromValue($value);

            return $cell instanceof FormulaCell
                ? new StringCell((string) $cell->getValue(), $cell->style, $cell->comment)
                : $cell;
        }, $values);

        return new Row(array_values($cells));
    }
}
