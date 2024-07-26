<?php

namespace App\Generators;

use Illuminate\Support\Facades\Log;
use PhpOffice\PhpWord\Element;
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

    public function write()
    {
        if (! $this->doc) {
            Log::error('Doc must be generated before writing.');

            return;
        }

        try {

            $path = $this->getPath($this->fileName, $this->dir);

            $writer = IOFactory::createWriter($this->doc);

            $writer->save($path);
        } catch (\Exception $e) {
            Log::error('Error saving doc: '.$this->fileName.' '.$e->getMessage());
            throw $e;
        }
    }

    protected function addLabelText(Element\Section $section, string $label, string $text)
    {
        $run = $section->addTextRun();
        $run->addText($label.': ', $this->strong);
        $run->addText($text);
    }

    protected function setup()
    {

        $this->doc = new PhpWord();

        $this->doc->addTitleStyle(1, ['size' => 22, 'bold' => true], ['spaceBefore' => 240, 'spaceAfter' => 120]);
        $this->doc->addTitleStyle(2, ['size' => 18, 'bold' => true], ['spaceBefore' => 240, 'spaceAfter' => 120]);
        $this->doc->addTitleStyle(3, ['size' => 15, 'bold' => true], ['spaceBefore' => 240, 'spaceAfter' => 120]);
        $this->doc->addTitleStyle(4, ['size' => 13, 'bold' => true], ['spaceBefore' => 240, 'spaceAfter' => 120]);
        $this->doc->addTitleStyle(4, ['size' => 12, 'bold' => true], ['spaceBefore' => 240, 'spaceAfter' => 120]);

        $this->strong = ['bold' => true];
    }
}
