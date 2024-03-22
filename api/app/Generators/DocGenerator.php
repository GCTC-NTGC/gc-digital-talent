<?php

namespace App\Generators;

use Illuminate\Support\Facades\Storage;
use \PhpOffice\PhpWord\PhpWord;
use \PhpOffice\PhpWord\IOFactory;

abstract class DocGenerator {

    protected PhpWord $doc;

    public function __construct()
    {
        $this->doc = new PhpWord();

        $this->doc->addTitleStyle(1, ['size' => 22, 'bold' => true]);
        $this->doc->addTitleStyle(2, ['size' => 18, 'bold' => true]);
        $this->doc->addTitleStyle(3, ['size' => 15, 'bold' => true]);
        $this->doc->addTitleStyle(4, ['size' => 13, 'bold' => true]);
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
}
