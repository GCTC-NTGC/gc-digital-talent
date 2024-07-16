<?php

namespace App\Generators;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

abstract class FileGenerator
{
    abstract public function generate();

    abstract public function write(string $fileName, ?string $dir);

    protected function sanitizeEnum(string $enum): string
    {
        return ucwords(strtolower(str_replace('_', ' ', $enum)));
    }

    public function yesOrNo(bool $value): string
    {
        return $value ? 'Yes' : 'No';
    }

    public function getPath(string $fileName, ?string $dir, ?string $disk = 'userGenerated')
    {
        /** @var \Illuminate\Filesystem\FilesystemManager */
        $disk = Storage::disk($disk);
        if ($dir && ! $disk->exists($dir)) {
            File::makeDirectory($disk->path($dir));
        }

        return $disk->path(sprintf('%s/%s', $dir ? DIRECTORY_SEPARATOR.$dir : '', $fileName));
    }
}
