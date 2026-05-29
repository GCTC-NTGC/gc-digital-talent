<?php

namespace App\Generators;

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
}
