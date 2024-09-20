<?php

namespace App\Generators;

use Illuminate\Support\Facades\Log;
use ZipArchive;

abstract class ZipGenerator extends FileGenerator implements FileGeneratorInterface
{
    protected array $files = [];

    protected int $iteration = 0;

    protected string $extension = 'zip';

    public function __construct(public string $fileName, protected ?string $dir)
    {
        parent::__construct($fileName, $dir);
    }

    protected function addFile(FileGeneratorInterface $fileGenerator)
    {
        $this->files[$fileGenerator->getFileNameWithExtension()] = $fileGenerator->getPath();
    }

    protected function incrementFileName(FileGeneratorInterface $fileGenerator): FileGeneratorInterface
    {
        $fileName = $fileGenerator->getFileName();
        $currentCount = array_reduce($this->files, function ($count, $item) use ($fileName) {
            if (str_contains($item, $fileName)) {
                $count += 1;
            }

            return $count;
        }, 0);

        if ($currentCount) {
            $fileGenerator->setFileName($fileName.' '.$currentCount);
        }

        return $fileGenerator;
    }

    public function write()
    {
        try {
            $zip = new ZipArchive();
            $zipPath = $this->getPath();
            if ($zip->open($zipPath, ZipArchive::CREATE)) {
                foreach ($this->files as $name => $path) {
                    $zip->addFile($path, $name);
                }
                $zip->close();
            }
            foreach ($this->files as $path) {
                unlink($path);
            }
        } catch (\Throwable $e) {
            // Log message and bubble it up
            Log::error('Error saving zip: '.$this->fileName.' '.$e->getMessage());
            throw $e;
        }
    }
}
