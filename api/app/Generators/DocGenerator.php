<?php

namespace App\Generators;

use Illuminate\Support\Facades\Log;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\PhpWord;

abstract class DocGenerator extends FileGenerator implements FileGeneratorInterface
{
    protected ?PhpWord $doc;

    protected array $strong;

    public function __construct(public string $fileName, protected ?string $dir)
    {
        parent::__construct($fileName, $dir);
    }

    /**
     * Write the document to disk
     */
    public function write()
    {
        if (! $this->doc) {
            Log::error('Doc must be generated before writing.');

            return;
        }

        try {
            $path = $this->getPath();
            $writer = IOFactory::createWriter($this->doc);
            $writer->save($path);
        } catch (\Throwable $e) {
            Log::error('Error saving doc: '.$this->fileName.' '.$e->getMessage());
            throw $e;
        }
    }

    /**
     * Creates the document for generation
     */
    protected function setup()
    {

        $this->doc = new PhpWord();

        $this->doc->addTitleStyle(1, ['size' => 22, 'bold' => true], ['spaceBefore' => 240, 'spaceAfter' => 120]);
        $this->doc->addTitleStyle(2, ['size' => 18, 'bold' => true], ['spaceBefore' => 240, 'spaceAfter' => 120]);
        $this->doc->addTitleStyle(3, ['size' => 15, 'bold' => true], ['spaceBefore' => 240, 'spaceAfter' => 120]);
        $this->doc->addTitleStyle(4, ['size' => 13, 'bold' => true], ['spaceBefore' => 240, 'spaceAfter' => 120]);
        $this->doc->addTitleStyle(5, ['size' => 12, 'bold' => true], ['spaceBefore' => 240, 'spaceAfter' => 120]);

        $this->strong = ['bold' => true];
    }
}
