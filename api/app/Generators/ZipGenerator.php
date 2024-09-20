<?php

namespace App\Generators;

use Illuminate\Support\Facades\Log;
use ZipArchive;

abstract class ZipGenerator extends FileGenerator implements FileGeneratorInterface
{
    protected array $files;

    public function __construct(public string $fileName, protected ?string $dir)
    {
        parent::__construct($fileName, $dir);

        $this->files = [];
    }

    public function addFile(FileGeneratorInterface $fileGenerator)
    {
        $this->files[$fileGenerator->getPath()] = $fileGenerator->getFileName();
    }

    public function addFiles()
    {

        try {
            $zip = new ZipArchive();
            $zipPath = $this->getPath();
            if ($zip->open($zipPath, ZipArchive::CREATE)) {
                foreach ($this->files as $path => $name) {
                    $zip->addFile($path, $name);
                }
                $zip->close();
            }
        } catch (\Throwable $e) {
            Log::error($e);

            return false;
        }
    }

    public function write()
    {
        try {
            $this->addFiles();
        } catch (\Throwable $e) {
            // Log message and bubble it up
            Log::error('Error saving csv: '.$this->fileName.' '.$e->getMessage());
            throw $e;
        }
    }
}
