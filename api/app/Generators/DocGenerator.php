<?php

namespace App\Generators;

use PhpOffice\PhpWord\Element;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\PhpWord;

abstract class DocGenerator extends FileGenerator
{
    protected PhpWord $doc;

    protected array $strong;

    public function __construct()
    {
        $this->doc = new PhpWord();

        $this->doc->addTitleStyle(1, ['size' => 22, 'bold' => true], ['spaceBefore' => 240, 'spaceAfter' => 120]);
        $this->doc->addTitleStyle(2, ['size' => 18, 'bold' => true], ['spaceBefore' => 240, 'spaceAfter' => 120]);
        $this->doc->addTitleStyle(3, ['size' => 15, 'bold' => true], ['spaceBefore' => 240, 'spaceAfter' => 120]);
        $this->doc->addTitleStyle(4, ['size' => 13, 'bold' => true], ['spaceBefore' => 240, 'spaceAfter' => 120]);
        $this->doc->addTitleStyle(4, ['size' => 12, 'bold' => true], ['spaceBefore' => 240, 'spaceAfter' => 120]);

        $this->strong = ['bold' => true];
    }

    public function write(string $fileName, ?string $dir)
    {

        $path = $this->getPath($fileName, $dir);

        $writer = IOFactory::createWriter($this->doc);

        return $writer->save($path);
    }

    protected function addLabelText(Element\Section $section, string $label, string $text)
    {
        $run = $section->addTextRun();
        $run->addText($label.': ', $this->strong);
        $run->addText($text);
    }
}
