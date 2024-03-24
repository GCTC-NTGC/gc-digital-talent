<?php

namespace App\Generators;

use Illuminate\Support\Facades\Storage;
use \PhpOffice\PhpWord\PhpWord;
use \PhpOffice\PhpWord\IOFactory;
use \PhpOffice\PhpWord\Element;

abstract class DocGenerator {

    protected PhpWord $doc;
    protected array $strong;

    public function __construct()
    {
        $this->doc = new PhpWord();

        $this->doc->addTitleStyle(1, ['size' => 22, 'bold' => true], ['spaceBefore' => 240, 'spaceAfter' => 120]);
        $this->doc->addTitleStyle(2, ['size' => 18, 'bold' => true], ['spaceBefore' => 240, 'spaceAfter' => 120]);
        $this->doc->addTitleStyle(3, ['size' => 15, 'bold' => true], ['spaceBefore' => 240, 'spaceAfter' => 120]);
        $this->doc->addTitleStyle(4, ['size' => 13, 'bold' => true],    ['spaceBefore' => 240, 'spaceAfter' => 120]);

        $this->strong = ['bold' => true];
    }

    abstract function generate();

    public function write(string $fileName)
    {
       /** @var \Illuminate\Filesystem\FilesystemManager */
        $disk = Storage::disk('generated');

        $path = $disk->path($fileName);

        $writer = IOFactory::createWriter($this->doc);

        return $writer->save($path);
    }

    protected function addSubTitle(Element\Section $section, string $text, ?int $rank = 3)
    {
        $section->addTitle($text, $rank);
    }

    protected function addLabelText(Element\Section $section, string $label, string $text)
    {
        $run = $section->addTextRun();
        $run->addText($label.': ', $this->strong);
        $run->addText($text);
    }

}
